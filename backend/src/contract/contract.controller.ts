import { Controller, Post, Body, UseGuards, Get, Param, Req, Put } from '@nestjs/common';
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
  @Get(':providerId/:eventId')
  @UseGuards(AuthGuard)
  async getContractForProviderAndEvent(
    @Param('providerId') providerId: string,
    @Param('eventId') eventId: string
  ) {
    return this.contractService.getContractForProviderAndEvent(providerId, eventId);
  }
  @Get('/:eventId')
  @UseGuards(AuthGuard)
  async getContractForMeAndEvent(
    @Param('eventId') eventId: string,
    @Req() request: Request
  ) {
    const providerId = request['user'].providerId;
    return this.contractService.getContractForProviderAndEvent(providerId, eventId);
  }
  @Get('not/approved/:eventId')
  @UseGuards(AuthGuard)
  async getContractNotApproved( @Param('eventId') eventId: string){
    return this.contractService.getContractsExcludingExisting(eventId);
  }
  @Put('/:contractId')
  @UseGuards(AuthGuard)
  async updateContract(
    @Param('contractId') contractId: string,
    @Body() updateContractDto: any
  ) {
    return this.contractService.updateContract(contractId, updateContractDto);
  }
}
