// src/service/service.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { ServiceSchema } from './service.schema'; // Import the Service schema

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Service', schema: ServiceSchema }]),
  ],
  providers: [ServiceService],
  controllers: [ServiceController],
})
export class ServiceModule {}

