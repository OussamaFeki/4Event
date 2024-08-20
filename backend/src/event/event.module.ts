// src/event/event.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventSchema } from './event.schema';
import { ProviderModule } from '../provider/provider.module';
import { PaymentModule } from '../payment/payment.module';
import { Provider, ProviderSchema } from '../provider/provider.schema'; // Adjusted import path
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module'; // Adjusted import path
import { AuthGuard } from '../shared/auth/auth.gard'; // Assuming this is the correct path for your AuthGuard
import { User, UserSchema } from 'src/user/user.schema';
import { Availability, AvailabilitySchema } from 'src/availability/availability.schema';
import { AvailabilityModule } from 'src/availability/availability.module';
import { Contract, ContractSchema } from 'src/contract/contract.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema }, // Using Event.name for consistency
      { name: Provider.name, schema: ProviderSchema },
      {name:User.name, schema:UserSchema},
      {name:Availability.name,schema:AvailabilitySchema},
      {name:Contract.name,schema:ContractSchema}
    ]),
    ProviderModule,
    PaymentModule,
    UserModule,
    AvailabilityModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [EventService, AuthGuard], // Assuming AuthGuard is correctly implemented
  controllers: [EventController],
})
export class EventModule {}
