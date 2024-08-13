import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Availability } from './availability.schema';
import { Provider } from '../provider/provider.schema';
import { startOfWeek, endOfWeek, format } from 'date-fns';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectModel(Availability.name) private availabilityModel: Model<Availability>,
    @InjectModel(Provider.name) private providerModel: Model<Provider>,
  ) {}

  async updateAvailability(providerId: string, availabilityDto: any): Promise<Provider> {
    const provider = await this.providerModel.findById(providerId).populate('availabilities').exec();

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    let availability: Availability | null = null;

    if (availabilityDto.dayOfWeek) {
      availability = await this.availabilityModel.findOne({
        provider: providerId,
        dayOfWeek: availabilityDto.dayOfWeek
      }).exec();
    }

    if (!availability) {
      // Create a new availability if it does not exist
      availability = new this.availabilityModel({
        dayOfWeek: availabilityDto.dayOfWeek,
        startTime: availabilityDto.startTime,
        endTime: availabilityDto.endTime,
        provider: providerId,
      });
      await availability.save();
      provider.availabilities.push(availability);
    } else {
      // Update existing availability
      availability.startTime = availabilityDto.startTime;
      availability.endTime = availabilityDto.endTime;
      availability.updatedAt = new Date();
      await availability.save();
    }

    provider.updatedAt = new Date();
    await provider.save();

    return provider;
  }
   // New method to get all availabilities of a specific provider
   async getProviderAvailabilities(providerId: string): Promise<Availability[]> {
    const provider = await this.providerModel.findById(providerId).exec();

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return this.availabilityModel.find({ provider: providerId }).exec();
  }
  // New method to add availability with overlap prevention
  async addAvailability(providerId: string, availabilityDto: any): Promise<Availability> {
    const provider = await this.providerModel.findById(providerId).exec();

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Check for overlapping availabilities
    const existingAvailabilities = await this.availabilityModel.find({
      provider: providerId,
      dayOfWeek: availabilityDto.dayOfWeek,
      $or: [
        {
          startTime: { $lt: availabilityDto.endTime },
          endTime: { $gt: availabilityDto.startTime }
        }
      ]
    }).exec();

    if (existingAvailabilities.length > 0) {
      throw new BadRequestException('Overlapping availability found');
    }

    // Create new availability
    const newAvailability = new this.availabilityModel({
      dayOfWeek: availabilityDto.dayOfWeek,
      startTime: availabilityDto.startTime,
      endTime: availabilityDto.endTime,
      provider: providerId,
    });

    await newAvailability.save();
    provider.availabilities.push(newAvailability);
    provider.updatedAt = new Date();
    await provider.save();

    return newAvailability;
  }
  async updateAvailabilityById(
    providerId: string,
    availabilityId: string,
    availabilityDto: any
  ): Promise<Availability> {
    const provider = await this.providerModel.findById(providerId).populate('events').exec();
  
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }
  
    const availability = await this.availabilityModel.findOne({
      _id: availabilityId,
      provider: providerId,
    }).exec();
  
    if (!availability) {
      throw new NotFoundException('Availability not found');
    }
  
    // Convert new or existing start and end times to Date objects
    const updatedStartTime = new Date(`1970-01-01T${availabilityDto.startTime || availability.startTime}:00Z`);
    const updatedEndTime = new Date(`1970-01-01T${availabilityDto.endTime || availability.endTime}:00Z`);
  
    // Check for overlapping events
    const overlappingEvent = provider.events.some(event => {
      const eventDate = new Date(event.date);
      const eventDayOfWeek = eventDate.toLocaleString('default', { weekday: 'long' }).toUpperCase();
  
      // Convert event start and end times to Date objects
      const eventStartTime = new Date(`1970-01-01T${event.startTime}:00Z`);
      const eventEndTime = new Date(`1970-01-01T${event.endTime}:00Z`);
  
      return (
        eventDayOfWeek === availabilityDto.dayOfWeek && // Ensure the event is on the same day
        ((eventStartTime >= updatedStartTime && eventStartTime < updatedEndTime) ||
          (eventEndTime > updatedStartTime && eventEndTime <= updatedEndTime) ||
          (eventStartTime <= updatedStartTime && eventEndTime >= updatedEndTime))
      );
    });
  
    if (overlappingEvent) {
      throw new ConflictException('Cannot update availability due to an overlapping event.');
    }
  
    // Update existing availability
    availability.dayOfWeek = availabilityDto.dayOfWeek || availability.dayOfWeek;
    availability.startTime = availabilityDto.startTime || availability.startTime;
    availability.endTime = availabilityDto.endTime || availability.endTime;
    availability.updatedAt = new Date();
  
    await availability.save();
  
    provider.updatedAt = new Date();
    await provider.save();
  
    return availability;
  }
  async deleteAvailability(providerId: string, availabilityId: string): Promise<void> {
    const provider = await this.providerModel.findById(providerId).populate('events').exec();

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const availability = await this.availabilityModel.findOne({
      _id: availabilityId,
      provider: providerId,
    }).exec();

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    // Get the start and end of the current week
    const currentDate = new Date();
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);

    // Create a mapping from day names to day numbers
    const dayMapping = {
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6
    };

    // Check for overlapping events in the current week
    const overlappingEvent = provider.events.some(event => {
      const eventDate = new Date(event.date);
      const eventDayOfWeek = format(eventDate, 'EEEE').toUpperCase();
      
      // Convert availability and event times to Date objects for comparison
      const availabilityStart = new Date(`1970-01-01T${availability.startTime}:00Z`);
      const availabilityEnd = new Date(`1970-01-01T${availability.endTime}:00Z`);
      const eventStart = new Date(`1970-01-01T${event.startTime}:00Z`);
      const eventEnd = new Date(`1970-01-01T${event.endTime}:00Z`);

      return (
        eventDate >= weekStart &&
        eventDate <= weekEnd &&
        eventDayOfWeek === availability.dayOfWeek &&
        ((eventStart >= availabilityStart && eventStart < availabilityEnd) ||
         (eventEnd > availabilityStart && eventEnd <= availabilityEnd) ||
         (eventStart <= availabilityStart && eventEnd >= availabilityEnd))
      );
    });

    if (overlappingEvent) {
      throw new ConflictException('Cannot delete availability due to an overlapping event in the current week.');
    }

    // Delete the availability
    await this.availabilityModel.findByIdAndDelete(availabilityId).exec();

    // Remove the availability from the provider's availabilities array
    provider.availabilities = provider.availabilities.filter(
      avail => avail.toString() !== availabilityId
    );
    provider.updatedAt = new Date();
    await provider.save();
  }
}


