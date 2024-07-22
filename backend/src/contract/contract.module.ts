// src/contract/contract.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { ContractSchema } from './contract.schema'; // Import the Contract schema
import { EventModule } from '../event/event.module'; // Adjust the import as per your structure
import { ProviderModule } from '../provider/provider.module'; // Adjust the import as per your structure

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Contract', schema: ContractSchema }]),
    EventModule, // Import EventModule if Event is referenced in Contract
    ProviderModule, // Import ProviderModule if Provider is referenced in Contract
  ],
  providers: [ContractService],
  controllers: [ContractController],
})
export class ContractModule {}
