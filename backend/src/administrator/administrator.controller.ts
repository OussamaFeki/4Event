import { Controller, Post, Body, BadRequestException, HttpException, HttpStatus  } from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { Administrator } from './administrator.schema';

@Controller('administrators')
export class AdministratorController {
  constructor(private readonly administratorService: AdministratorService) {}

  @Post('signup')
  async signup(@Body() createAdministratorDto: any): Promise<Administrator> {
    return this.administratorService.signup(createAdministratorDto);
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    try {
      const { token } = await this.administratorService.login(loginDto);
      return { token };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
  // Other routes...
}

