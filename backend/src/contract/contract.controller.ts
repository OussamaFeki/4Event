// src/contract/contract.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { ContractService } from './contract.service';

@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  async createContract(@Body() createContractDto: any) {
    return this.contractService.createContract(createContractDto);
  }

  // Add other routes as needed
}

