// src/contract/contract.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contract } from './contract.schema';

@Injectable()
export class ContractService {
  constructor(@InjectModel(Contract.name) private contractModel: Model<Contract>) {}

  async createContract(createContractDto: any): Promise<Contract> {
    const createdContract = new this.contractModel(createContractDto);
    return createdContract.save();
  }

  // Add other methods as needed
}
