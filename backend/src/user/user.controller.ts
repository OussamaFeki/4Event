import { Controller, Post, Body , Put , Param, Get, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../shared/dto/create-user.dto';
import { AuthGuard } from 'src/shared/auth/auth.gard';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.signup(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: any) {
    return this.userService.login(loginUserDto);
  }
  @Get('me')
  @UseGuards(AuthGuard)
  async getdata(@Req() request: Request){
    const userId = request['user'].userId;
    const providerId = request['user'].providerId;
    let userType: 'user' | 'provider';
    if (userId) {
      userType = 'user';
    } else if (providerId) {
      userType = 'provider';
    } else {
      throw new UnauthorizedException('Invalid token');
    }
    const id = userId || providerId;
    return this.userService.getdata(id,userType)
  }
  @Get('providers')
  @UseGuards(AuthGuard)
  async getAllProviders() {
    return this.userService.getAllProviders();
  }
}

