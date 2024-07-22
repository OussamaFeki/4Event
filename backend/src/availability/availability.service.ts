import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Availability } from './availability.schema';
import { Provider } from '../provider/provider.schema';

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
}


