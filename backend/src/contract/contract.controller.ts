import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ContractService } from './contract.service';
import { AuthGuard } from 'src/shared/auth/auth.gard';

@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post() 
  @UseGuards(AuthGuard)
  async createContract(
    @Body('eventId') eventId: string,
    @Body('providerId') providerId: string,
    @Body() createContractDto: any,
  ) {
    return this.contractService.createContract(createContractDto, eventId, providerId);
  }

  // Add other routes as needed
}
