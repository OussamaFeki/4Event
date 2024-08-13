import { Controller, Post, Put, Delete, Body, Param, UseGuards, Req, NotFoundException, Get } from '@nestjs/common';
import { ServiceService } from './service.service';
import { AuthGuard } from '../shared/auth/auth.gard';
 // Import the AuthGuard

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createService(@Req() request: Request, @Body() createServiceDto: any) {
    const providerId = request['user'].providerId;
    if (!providerId) {
      throw new NotFoundException('Provider not found in token');
    }

    return await this.serviceService.createService(providerId, createServiceDto);
  }

  @Put('/:serviceId')
  @UseGuards(AuthGuard)
  async updateService(@Req() request: Request, @Param('serviceId') serviceId: string, @Body() updateServiceDto: any) {
    const providerId = request['user'].providerId;
    if (!providerId) {
      throw new NotFoundException('Provider not found in token');
    }

    return await this.serviceService.updateService(providerId, serviceId, updateServiceDto);
  }

  @Delete('/:serviceId')
  @UseGuards(AuthGuard)
  async deleteService(@Req() request: Request, @Param('serviceId') serviceId: string) {
    const providerId = request['user'].providerId;
    if (!providerId) {
      throw new NotFoundException('Provider not found in token');
    }

    return await this.serviceService.deleteService(providerId, serviceId);
  }
  @Get('/services')
  @UseGuards(AuthGuard)
  async getServices(@Req() request: Request, @Param('serviceId') serviceId: string) {
    const providerId = request['user'].providerId;
    if (!providerId) {
      throw new NotFoundException('Provider not found in token');
    }
    return await this.serviceService.getServicesByProvider(providerId);
  }
}
