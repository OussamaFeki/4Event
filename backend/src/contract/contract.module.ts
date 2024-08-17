// src/contract/contract.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { ContractSchema } from './contract.schema'; // Import the Contract schema
import { EventModule } from '../event/event.module'; // Adjust the import as per your structure
import { ProviderModule } from '../provider/provider.module'; // Adjust the import as per your structure
import { EventSchema } from 'src/event/event.schema';
import { ProviderSchema } from 'src/provider/provider.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/shared/auth/auth.gard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Contract', schema: ContractSchema }]),
    MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
    MongooseModule.forFeature([{ name: 'Provider', schema: ProviderSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),// Ensure AuthGuard can be used
  ],
  providers: [ContractService,AuthGuard],
  controllers: [ContractController],
})
export class ContractModule {}
