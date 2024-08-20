import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Contract } from './contract.schema';
import { Event } from 'src/event/event.schema';
import { Provider } from 'src/provider/provider.schema';

@Injectable()
export class ContractService {
  constructor( 
    @InjectModel(Contract.name) private contractModel: Model<Contract>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Provider.name) private providerModel: Model<Provider>
  ) {}

  async createContract(createContractDto: any, eventId: string, providerId: string): Promise<Contract> {
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const provider = await this.providerModel.findById(providerId).exec();
    if (!provider) {
      throw new NotFoundException(`Provider with ID ${providerId} not found`);
    }

    const createdContract = new this.contractModel({
      ...createContractDto,
      event,
      provider,
    });

    return createdContract.save();
  }

  async getContractForProviderAndEvent(providerId: string, eventId: string): Promise<Contract | null> {
    try {
      // Check if providerId is a valid ObjectId
      if (!Types.ObjectId.isValid(providerId)) {
        throw new NotFoundException(`Invalid provider ID: ${providerId}`);
      }
  
      const contract = await this.contractModel.findOne({
        provider: new Types.ObjectId(providerId),
        event: new Types.ObjectId(eventId)
      })
      .populate('event')
      .populate('provider')
      .exec();
  
      if (!contract) {
        throw new NotFoundException(`Contract not found for provider ${providerId} and event ${eventId}`);
      }
  
      return contract;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new NotFoundException(`Contract not found for provider ${providerId} and event ${eventId}`);
      }
    }
  }
  async getContractsExcludingExisting(eventId: string): Promise<Contract[]> {
    // Find the event by the given event ID
    const event = await this.eventModel.findById(eventId).populate('contracts').exec();

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Get all contracts except those already associated with the event
    let existingContractIds=[];
    if(event.contracts.length>0){
      existingContractIds = event.contracts.map((contract: Contract) => contract._id);
    }
    console.log(existingContractIds)
    const contracts = await this.contractModel.find({
      event: eventId,
      _id: { $nin: existingContractIds },
    }).exec();

    return contracts;
  }
  async updateContract(contractId: string, updateContractDto: { price: number, terms: string }): Promise<Contract> {
    const contract = await this.contractModel.findById(contractId).exec();

    if (!contract) {
      throw new NotFoundException(`Contract with ID ${contractId} not found`);
    }

    // Update the price and terms fields
    contract.price = updateContractDto.price;
    contract.terms = updateContractDto.terms;
    contract.updatedAt = new Date(); // Update the updatedAt timestamp

    return contract.save();
  }

  // Add other methods as needed
}
