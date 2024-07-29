import { Controller, Put, Body, Param, UseGuards, Req,UnauthorizedException, Get  } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '../shared/auth/auth.gard';
import { Request } from 'express';
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put('update')
  @UseGuards(AuthGuard)
  async updateProfile(
    @Req() request: Request,
    @Body() updateProfileDto: any,
  ) {
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

    return this.profileService.updateProfile(id, updateProfileDto, userType);
  }
  @Get('has-profile')
  @UseGuards(AuthGuard)
  async hasProfile(@Req() request: Request) {
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

    return this.profileService.hasProfile(id, userType);
  }
  @Get('')
  @UseGuards(AuthGuard)
  async getProfile(@Req() request: Request) {
    const token = request['user'];
    return this.profileService.getProfile(token);
  }
}

