import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ClientService } from './client.service'; // Assuming ClientService is in the same folder

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async createClient(
    @Body() createClientDto:any,
    @Body('userId') userId: string, // Assuming userId is passed in the request body
    @Body('message') message: string // Assuming the message content is passed in the request body
  ) {
    return this.clientService.createClient(createClientDto, userId, message);
  }
  @Get('users')
  async getusers(){
    return this.clientService.getAllUsers();
  }
}
