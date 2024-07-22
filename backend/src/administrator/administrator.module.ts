// src/administrator/administrator.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdministratorService } from './administrator.service';
import { AdministratorController } from './administrator.controller';
import { AdministratorSchema } from './administrator.schema'; // Import the Administrator schema if used

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Administrator', schema: AdministratorSchema }]), // Include schema if used
  ],
  providers: [AdministratorService],
  controllers: [AdministratorController],
})
export class AdministratorModule {}
