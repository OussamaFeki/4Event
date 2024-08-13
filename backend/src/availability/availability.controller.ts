import { Controller, Put, Body, UseGuards, Req, UnauthorizedException, Get, Post, Param, Delete } from '@nestjs/common';
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
  @Get('availabilities')
  @UseGuards(AuthGuard)
  async getAvailabilities(@Req() request: Request) {
    const providerId = request['user'].providerId;
    return this.availabilityService.getProviderAvailabilities(providerId);
  }
  @Post('add')
  @UseGuards(AuthGuard)
  async addAvailability(@Req() request: Request, @Body() availabilityDto: any) {
    const providerId = request['user'].providerId;

    if (!providerId) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.availabilityService.addAvailability(providerId, availabilityDto);
  }
  @Put('update/:availabilityId')
@UseGuards(AuthGuard)
async updateAvailabilityById(
  @Req() request: Request,
  @Body() availabilityDto: any,
  @Param('availabilityId') availabilityId: string
) {
  const providerId = request['user'].providerId;

  if (!providerId) {
    throw new UnauthorizedException('Invalid token');
  }

  return this.availabilityService.updateAvailabilityById(providerId, availabilityId, availabilityDto);
}
@Delete(':availabilityId')
@UseGuards(AuthGuard)
async deleteAvailabilityById(
  @Req() request: Request,
  @Body() availabilityDto: any,
  @Param('availabilityId') availabilityId: string
) {
  const providerId = request['user'].providerId;

  if (!providerId) {
    throw new UnauthorizedException('Invalid token');
  }

  return this.availabilityService.deleteAvailability(providerId, availabilityId);
}
}
