import { Controller, Put, Param, UseGuards, Req, NotFoundException, ForbiddenException, Post, Body, Get, Delete } from '@nestjs/common';
import { EventService } from './event.service';
import { AuthGuard } from '../shared/auth/auth.gard';
import { Request } from 'express';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Put('/:eventId/accept')
  @UseGuards(AuthGuard)
  async acceptEvent(@Req() request: Request, @Param('eventId') eventId: string) {
    const providerId = request['user'].providerId;
    if (!providerId) {
      throw new NotFoundException('Provider not found in token');
    }

    await this.eventService.acceptEvent(providerId, eventId);
  }

  @Put('/:eventId/refuse')
  @UseGuards(AuthGuard)
  async refuseEvent(@Req() request: Request, @Param('eventId') eventId: string) {
    const providerId = request['user'].providerId;
    if (!providerId) {
      throw new NotFoundException('Provider not found in token');
    }

    await this.eventService.refuseEvent(providerId, eventId);
  }
  @Put('/:eventId/request/:providerId')
  @UseGuards(AuthGuard)
  async sendRequest(
    @Req() request: Request,
    @Param('eventId') eventId: string,
    @Param('providerId') providerId: string
  ) {
    const userId = request['user'].userId; // Assuming 'userId' is the property in the token

    try {
      await this.eventService.sendRequest(userId, providerId, eventId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error; // Re-throw known exceptions for appropriate handling
      }
      throw new NotFoundException('Event or Provider not found'); // Default catch for any other unknown errors
    }
  }
  @Post('create')
  @UseGuards(AuthGuard)
  async createEvent(@Req() request: Request, @Body() createEventDto: any) {
    const userId = request['user'].userId; // Assuming 'userId' is the property in the token

    try {
      const newEvent = await this.eventService.createEvent(userId, createEventDto);
      return { message: 'Event created successfully', event: newEvent };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw known exceptions for appropriate handling
      }
      throw new NotFoundException('User not found or invalid data'); // Default catch for any other unknown errors
    }
  }
  @Get('provider/data')
  @UseGuards(AuthGuard)
  async getProviderData(@Req() request: Request) {
    const providerId = request['user'].providerId;
    if (!providerId) {
      throw new ForbiddenException('Provider ID not found in token');
    }

    return this.eventService.getProviderData(providerId);
  }
  @Get('provider/:providerId/data')
  @UseGuards(AuthGuard)
  async getProviderDataForUser(@Req() request: Request, @Param('providerId') providerId: string) {
    const userId = request['user'].userId;
    if (!userId) {
      throw new ForbiddenException('User ID not found in token');
    }

    return this.eventService.getProviderDataForUser(userId, providerId);
  }
  @Get('provider/monthly-budget')
  @UseGuards(AuthGuard)
  async getMonthlyBudgetSum(@Req() request: Request) {
    const providerId = request['user'].providerId;
    if (!providerId) {
      throw new ForbiddenException('User ID not found in token');
    }

    const monthlyBudgetSum = await this.eventService.getMonthlyBudgetSum(providerId);
    return { monthlyBudgetSum };
  }
  @Get('provider/availability-percentage')
  @UseGuards(AuthGuard)
  async getEventAvailabilityPercentage(@Req() request: Request) {
    const providerId = request['user'].providerId;
    const percentage = await this.eventService.getEventAvailabilityPercentage(providerId);
    return { percentage };
  }
  @Get('provider/requests')
  @UseGuards(AuthGuard)
  async getProviderRequests(@Req() request: Request) {
    const providerId = request['user'].providerId;
    const data = await this.eventService.getProviderRequests(providerId);
    return data;
  }
  @Get('provider/stats')
  @UseGuards(AuthGuard)
  async getProviderStats(@Req() request: Request) {
    const providerId = request['user'].providerId;
    const data = await this.eventService.getProviderStats(providerId);
    return data;
  }
  @Get('organizer/events')
  @UseGuards(AuthGuard)
  async getOrganizerEvents(@Req() request:Request){
    const userId=request['user'].userId;
    const data =await this.eventService.getEventsOfOrganiser(userId);
    return data;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteEvent(@Req() request: Request, @Param('id') eventId: string) {
    const userId = request['user'].userId;
    await this.eventService.deleteEvent(userId, eventId);
    return { message: 'Event deleted successfully' };
  }
}
