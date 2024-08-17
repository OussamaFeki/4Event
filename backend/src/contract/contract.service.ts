import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contract } from './contract.schema';
import { Event } from 'src/event/event.schema';
import { Provider } from 'src/provider/provider.schema';


@Injectable()
export class ContractService {
  constructor( 
    @InjectModel(Contract.name) private contractModel: Model<Contract>,
    @InjectModel(Event.name) private eventModel: Model<Event>,          // Inject EventModel
    @InjectModel(Provider.name) private providerModel: Model<Provider>  // Inject ProviderModel
  ) {}

  async createContract(createContractDto: any, eventId: string, providerId: string): Promise<Contract> {
    // Fetch the Event and Provider using their respective IDs
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const provider = await this.providerModel.findById(providerId).exec();
    if (!provider) {
      throw new NotFoundException(`Provider with ID ${providerId} not found`);
    }

    // Create the contract with the fetched Event and Provider
    const createdContract = new this.contractModel({
      ...createContractDto,
      event,    // Assign the fetched event object
      provider, // Assign the fetched provider object
    });

    return createdContract.save();
  }

  // Add other methods as needed
}
