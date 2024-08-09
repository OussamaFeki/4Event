import { Controller, Post, Body , Put , Param, Get, UseGuards, Req, UnauthorizedException, NotFoundException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../shared/dto/create-user.dto';
import { AuthGuard } from 'src/shared/auth/auth.gard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @Get('provider/:id')
  @UseGuards(AuthGuard)
  async getProviderData(@Param('id') providerId: string) {
    const provider = await this.userService.getProviderData(providerId);
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }
    return provider;
  }
  @Post('avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(@Req() request: Request, @UploadedFile() file: Express.Multer.File) {
    const userId = request['user'].userId;
    const providerId = request['user'].providerId;
    if (!userId && !providerId) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.userService.updateAvatar(userId, providerId, file);
  }
}

