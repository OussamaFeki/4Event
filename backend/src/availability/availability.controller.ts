import { Controller, Put, Body, UseGuards, Req, UnauthorizedException, Get } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AuthGuard } from '../shared/auth/auth.gard';
import { Request } from 'express';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Put('update')
  @UseGuards(AuthGuard)
  async updateAvailability(@Req() request: Request, @Body() availabilityDto: any) {
    const providerId = request['user'].providerId;

    if (!providerId) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.availabilityService.updateAvailability(providerId, availabilityDto);
  }
  @Get('/availabilities')
  @UseGuards(AuthGuard)
  async getAvailabilities(@Req() request: Request) {
    const providerId = request['user'].providerId;
    return this.availabilityService.getProviderAvailabilities(providerId);
  }
}
