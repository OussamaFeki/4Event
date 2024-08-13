// src/service/service.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { ServiceSchema } from './service.schema'; // Import the Service schema
import { ProviderSchema } from '../provider/provider.schema'; // Import the Provider schema
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from '../shared/auth/auth.gard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Service', schema: ServiceSchema },
      { name: 'Provider', schema: ProviderSchema }
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),// Ensure AuthGuard can be used
  ],
  providers: [ServiceService, AuthGuard],
  controllers: [ServiceController],
})
export class ServiceModule {}
