import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './event.schema';
import { Provider } from '../provider/provider.schema';
import { User } from '../user/user.schema';
import { Availability } from 'src/availability/availability.schema';
import { DayOfWeek } from 'src/shared/enums/day-of-week.enum';
import { startOfWeek, endOfWeek,addMinutes, addDays, differenceInMinutes } from 'date-fns';
@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Provider.name) private providerModel: Model<Provider>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Availability.name) private availabilityModel: Model<Availability>,
  ) {}

  async acceptEvent(providerId: string, eventId: string): Promise<void> {
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const provider = await this.providerModel.findById(providerId).exec();
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Check if the provider already has events that overlap in time with the new event
    const overlappingEvent = await this.eventModel.findOne({
      _id: { $in: provider.events }, // Find events where provider is already participating
      date: event.date, // Ensure events are on the same date
      $or: [
        // Check overlapping conditions
        { startTime: { $gte: event.startTime, $lt: event.endTime } }, // New event starts during existing event
        { endTime: { $gt: event.startTime, $lte: event.endTime } }, // New event ends during existing event
        { startTime: { $lte: event.startTime }, endTime: { $gte: event.endTime } }, // New event completely within existing event
      ],
    }).exec();

    if (overlappingEvent) {
      throw new BadRequestException('Provider already has an event overlapping in time');
    }

    // Add the provider to the `providers` array of the event
    if (!event.providers.includes(provider)) {
      event.providers.push(provider);
      await event.save();
    }

    // Remove the event from the `requests` array of the provider
    await this.providerModel.findByIdAndUpdate(
      providerId,
      { $pull: { requests: eventId } },
      { new: true }
    ).exec();

    // Add the event to the `events` array of the provider
    if (!provider.events.includes(event)) {
      provider.events.push(event);
      await provider.save();
    }

       // Remove overlapping requests for the same date from the provider's requests array
       await this.providerModel.findByIdAndUpdate(
        providerId,
        {
          $pull: {
            requests: {
              $in: await this.eventModel.find({
                _id: { $in: provider.requests }, // Find requests in the provider's requests array
                date: event.date, // Ensure events are on the same date
                $or: [
                  // Check overlapping conditions
                  { startTime: { $gte: event.startTime, $lt: event.endTime } }, // Request starts during accepted event
                  { endTime: { $gt: event.startTime, $lte: event.endTime } }, // Request ends during accepted event
                  { startTime: { $lte: event.startTime }, endTime: { $gte: event.endTime } }, // Request completely within accepted event
                ],
              }).select('_id')
            },
          },
        },
        { new: true }
      ).exec();
    
  }

  async refuseEvent(providerId: string, eventId: string): Promise<void> {
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const provider = await this.providerModel.findByIdAndUpdate(
      providerId,
      { $pull: { requests: eventId } },
      { new: true }
    ).exec();

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Remove the event from the `requests` array of the provider
    await this.providerModel.findByIdAndUpdate(
      providerId,
      { $pull: { requests: eventId } },
      { new: true }
    ).exec();

    // Remove the provider from the `requests` array of the Event
    await this.eventModel.findByIdAndUpdate(
      eventId,
      { $pull: { requests: providerId } },
      { new: true }
    ).exec();
  }
  async sendRequest(userId: string, providerId: string, eventId: string): Promise<void> {
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (event.organizer.toString() !== userId) {
      throw new ForbiddenException('Only the event organizer can send requests');
    }

    const provider = await this.providerModel.findById(providerId).exec();
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Check if the provider is already in the event's requests
    if (event.requests.includes(provider)) {
      throw new ForbiddenException('Provider has already been requested for this event');
    }

    // Check if the event is already in the provider's requests
    if (provider.requests.includes(event)) {
      throw new ForbiddenException('Event has already been requested from this provider');
    }

    // Check if the event time is within the provider's availability time
    const eventDayOfWeek = event.date.toLocaleString('default', { weekday: 'long' }).toUpperCase();
    console.log(eventDayOfWeek);
    const availability = await this.availabilityModel.findOne({
      provider: provider._id,
      dayOfWeek: eventDayOfWeek,
      startTime: { $lte: event.startTime },
      endTime: { $gte: event.endTime },
    }).exec();

    if (!availability) {
      throw new ForbiddenException('Event time is not within provider availability time');
    }

    // Add the event to the `requests` array of the provider
    provider.requests.push(event._id as any);
    await provider.save();

    // Add the provider to the `requests` array of the Event
    event.requests.push(provider._id as any);
    await event.save();
  }
  async createEvent(userId: string, createEventDto: any): Promise<Event> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const { startTime, endTime } = createEventDto;
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be less than end time');
    }
  
    const newEvent = new this.eventModel({
      ...createEventDto,
      organizer: userId, // Assigning organizer as userId of the user
    });
  
    return newEvent.save();
  }
   // New method to get all availabilities and events of the connected provider
   async getProviderData(providerId: string): Promise<{ availabilities: Availability[], events: Event[] }> {
    const provider = await this.providerModel.findById(providerId).populate('availabilities events').exec();

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return {
      availabilities: provider.availabilities,
      events: provider.events,
    };
  }
  async getProviderDataForUser(userId: string, providerId: string): Promise<{ availabilities: Availability[], events: Event[], requests: Event[] }> {
    const provider = await this.providerModel.findById(providerId).populate('availabilities events').exec();

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const requests = await this.eventModel.find({ organizer: userId, requests: providerId }).exec();

    return {
      availabilities: provider.availabilities,
      events: provider.events,
      requests,
    };
  }
  // New method to calculate the sum of budget for each month of the current year
  async getMonthlyBudgetSum(providerId: string): Promise<{ month: string, totalAmount: number }[]> {
    const provider = await this.providerModel.findById(providerId).populate('events').exec();
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const events = await this.eventModel.find({
      _id: { $in: provider.events },
      date: {
        $gte: new Date(new Date().getFullYear(), 0, 1),
        $lt: new Date(new Date().getFullYear() + 1, 0, 1),
      }
    }).populate('payment').exec();

    const monthlyBudget = events.reduce((acc, event) => {
      const month = event.date.getMonth();
      const amount = event.payment ? event.payment.amount : 0;
      acc[month] = (acc[month] || 0) + amount;
      return acc;
    }, {});

    return Object.keys(monthlyBudget).map(month => ({
      month: new Date(new Date().getFullYear(), Number(month), 1).toLocaleString('default', { month: 'long' }),
      totalAmount: monthlyBudget[month]
    }));
  }
 
  
  async getEventAvailabilityPercentage(providerId: string): Promise<number> {
    const provider = await this.providerModel.findById(providerId)
      .populate('availabilities events')
      .exec();
  
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }
  
    const { availabilities, events } = provider;
  
    // Get the start and end of the current week
    const currentDate = new Date();
    const startOfCurrentWeek = startOfWeek(currentDate);
    const endOfCurrentWeek = endOfWeek(currentDate);
  
    // Filter events within the current week
    const eventsInCurrentWeek = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startOfCurrentWeek && eventDate <= endOfCurrentWeek;
    });
  
    if (eventsInCurrentWeek.length === 0) {
      return 0; // If no events in the current week, return 0%
    }
  
    // Calculate total event duration in minutes
    let totalEventDuration = 0;
    eventsInCurrentWeek.forEach(event => {
      const eventDate = new Date(event.date);
      const startTime = new Date(`${eventDate.toISOString().split('T')[0]}T${event.startTime}`);
      const endTime = new Date(`${eventDate.toISOString().split('T')[0]}T${event.endTime}`);
      totalEventDuration += differenceInMinutes(endTime, startTime);
    });
    // Calculate total available duration in minutes for the current week
    let totalAvailableDuration = 0;
    
     
    availabilities.forEach(slot => {
      const startTime = new Date(`1970-01-01T${slot.startTime}`);
      const endTime = new Date(`1970-01-01T${slot.endTime}`);
      totalAvailableDuration += differenceInMinutes(endTime, startTime);
    });
    
  
    if (totalAvailableDuration === 0) {
      return 0; // If no available time, return 0%
    }
  
    const percentage = (totalEventDuration / totalAvailableDuration) * 100;
    return percentage;
  }

  // New method to get all requests for a provider
  async getProviderRequests(providerId: string): Promise<Event[]> {
    const provider = await this.providerModel.findById(providerId).populate('requests').exec();

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }
    return provider.requests;
  }
  // New method to get total users, sum of prices, and total events for a provider
  async getProviderStats(providerId: string): Promise<{ totalUsers: number, totalPrices: number, totalEvents: number }> {
    const provider = await this.providerModel.findById(providerId).populate('events requests').exec();

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Populate the payment details within the events
    const events = await this.eventModel.find({ _id: { $in: provider.events } }).populate('payment').exec();

    const totalEvents = events.length;

    const totalPrices = events.reduce((sum, event) => {
      return sum + (event.payment?.amount || 0);
    }, 0);

    const uniqueUserIds = new Set<string>();
    events.forEach(event => {
      uniqueUserIds.add(event.organizer.toString());
    });

    const totalUsers = uniqueUserIds.size;

    return { totalUsers, totalPrices, totalEvents };
  }
  async getEventsOfOrganiser(userId):Promise<Event[]>{
    const events=await this.eventModel.find({organizer:userId}).exec();
    if(!events){
      throw new NotFoundException('there is no event');
    }
    return events;
  }
  async deleteEvent(userId: string, eventId: string): Promise<void> {
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if the user is the event organizer
    if (event.organizer.toString() !== userId) {
      throw new ForbiddenException('Only the event organizer can delete this event');
    }

    // Remove the event from all associated providers
    await this.providerModel.updateMany(
      { $or: [{ events: eventId }, { requests: eventId }] },
      { $pull: { events: eventId, requests: eventId } }
    ).exec();

    // Delete the event
    await this.eventModel.findByIdAndDelete(eventId).exec();
  }
  // New method to get providers available for the event date and time
  async getAvailableProvidersForEvent(eventId: string): Promise<Provider[]> {
    // Find the event by ID
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) {
        throw new NotFoundException('Event not found');
    }

    // Get the day of the week for the event date in uppercase (e.g., "SUNDAY")
    const eventDayOfWeek = event.date.toLocaleString('default', { weekday: 'long' }).toUpperCase();
    console.log(eventDayOfWeek);

    // Find all providers with their availabilities and events
    const providers = await this.providerModel.find().populate('availabilities events').exec();

    // Filter providers to find those available for the event
    const availableProviders = providers.filter(provider => {
        // Check if the provider has availability that matches the event's day and time
        const isAvailable = provider.availabilities.some(availability =>
            availability.dayOfWeek === eventDayOfWeek &&
            availability.startTime <= event.startTime &&
            availability.endTime >= event.endTime
        );

        // If the provider is not available, skip to the next one
        if (!isAvailable) return false;

        // Check if the provider has an overlapping event or the same request._id as the event
        const hasConflictingEventOrRequest = provider.events.some(existingEvent =>
            String(existingEvent._id) === String(event._id)  // Compare event IDs as strings
        );

        // Return true if the provider is available and has no conflicting events or matching request._id
        return !hasConflictingEventOrRequest;
    });

    return availableProviders;
}

  
  async getEventsBetween(userId: string, date: Date, startTime: string, endTime: string): Promise<Event[]> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    
  
    const events = await this.eventModel.find({
      organizer: userId,
      date: date,
      startTime: { $gte: `${startTime}` },
      endTime: { $lte: `${endTime}` }
    }).exec();
  
    return events;
  }
  async calculateAvailabilityRate(providerId: string): Promise<{ availableTime: number, pauseTime: number, eventTime: number }> {
    const provider = await this.providerModel.findById(providerId).populate('availabilities events').exec();
    
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }
  
    const { availabilities, events } = provider;
  
    let availableTime = 0;
    let pauseTime = 0;
    let eventTime = 0;
  
    // Mapping of JavaScript Date getDay() to DayOfWeek enum
    const dayOfWeekMap = [
      DayOfWeek.SUNDAY,
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY
    ];
  
    const currentDate = new Date();
    const currentDayOfWeek = dayOfWeekMap[currentDate.getDay()];
    
    const currentDayAvailabilities = availabilities.filter(a => a.dayOfWeek === currentDayOfWeek);
    const currentDayEvents = events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.toDateString() === currentDate.toDateString();
    });
  
    if (currentDayAvailabilities.length === 0 && currentDayEvents.length === 0) {
      // If there are no availabilities or events for the current day, set pause time to 100%
      return { availableTime: 0, pauseTime: 1440, eventTime: 0 };
    }
  
    for (const availability of availabilities) {
      const startAvailability = new Date(`1970-01-01T${availability.startTime}Z`);
      const endAvailability = new Date(`1970-01-01T${availability.endTime}Z`);
      const totalAvailabilityMinutes = differenceInMinutes(endAvailability, startAvailability);
      availableTime += totalAvailabilityMinutes;
  
      // Calculate event time and pause time for each availability
      const eventsForDay = events.filter(event => 
        dayOfWeekMap[new Date(event.date).getDay()] === availability.dayOfWeek
      );
  
      if (eventsForDay.length > 0) {
        // Sort events by start time
        eventsForDay.sort((a, b) => new Date(`1970-01-01T${a.startTime}Z`).getTime() - new Date(`1970-01-01T${b.startTime}Z`).getTime());
  
        let previousEndTime = startAvailability;
        
        for (const event of eventsForDay) {
          const startEvent = new Date(`1970-01-01T${event.startTime}Z`);
          const endEvent = new Date(`1970-01-01T${event.endTime}Z`);
          eventTime += differenceInMinutes(endEvent, startEvent);
  
          if (startEvent > previousEndTime) {
            pauseTime += differenceInMinutes(startEvent, previousEndTime);
          }
  
          previousEndTime = endEvent;
        }
  
        if (previousEndTime < endAvailability) {
          pauseTime += differenceInMinutes(endAvailability, previousEndTime);
        }
      } else {
        // If there are no events for this availability, count it all as pause time
        pauseTime += totalAvailabilityMinutes;
      }
    }
  
    return { availableTime, pauseTime, eventTime };
  }
}
