import { Controller, Post, Body } from '@nestjs/common';
import { ProviderService } from './provider.service';


@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post('signup')
  async signup(@Body() createProviderDto:any) {
    return this.providerService.signup(createProviderDto);
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    return this.providerService.login(loginDto);
  }
}
