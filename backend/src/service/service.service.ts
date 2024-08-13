import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Provider } from 'src/provider/provider.schema';
import { Service } from './service.schema';
import { Model } from 'mongoose';
 
@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<Service>,
    @InjectModel(Provider.name) private providerModel: Model<Provider>,
  ) {}

  async createService(providerId: string, serviceDto: any): Promise<Service> {
    const provider = await this.providerModel.findById(providerId).exec();

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const newService = new this.serviceModel(serviceDto);
    const savedService = await newService.save();

    provider.services.push(savedService);
    await provider.save();

    return savedService;
  }

  async updateService(providerId: string, serviceId: string, serviceDto: any): Promise<Service> {
    const provider = await this.providerModel.findById(providerId).exec();
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }
  
    const service = await this.serviceModel.findById(serviceId).exec();
    if (!service) {
      throw new NotFoundException('Service not found');
    }
  
    // Check if the serviceId matches any of the services' IDs in the provider's services array
    const serviceBelongsToProvider = provider.services.some(s => s._id.toString() === serviceId);
    if (!serviceBelongsToProvider) {
      throw new NotFoundException('Service does not belong to the provider');
    }
  
    service.name = serviceDto.name || service.name;
    service.description = serviceDto.description || service.description;
    service.price = serviceDto.price || service.price;
    service.updatedAt = new Date();
  
    return await service.save();
  }
  

  async deleteService(providerId: string, serviceId: string): Promise<void> {
    const provider = await this.providerModel.findById(providerId).exec();

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const serviceIndex = provider.services.findIndex(id => id.toString() === serviceId);

    if (serviceIndex === -1) {
      throw new NotFoundException('Service not found or does not belong to the provider');
    }

    provider.services.splice(serviceIndex, 1);
    await provider.save();

    await this.serviceModel.findByIdAndDelete(serviceId).exec();
  }

  async getServicesByProvider(providerId: string): Promise<Service[]> {
    const provider = await this.providerModel.findById(providerId).populate('services').exec();

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return provider.services;
  }
}