import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { Provider, ProviderSchema } from './provider.schema';
import { Profile, ProfileSchema } from '../profile/profile.schema';
import { Availability, AvailabilitySchema } from '../availability/availability.schema';
import { Service, ServiceSchema } from '../service/service.schema';
import { Event, EventSchema } from 'src/event/event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Provider.name, schema: ProviderSchema }]),
    MongooseModule.forFeature([{ name: Availability.name, schema: AvailabilitySchema }]),
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  providers: [ProviderService],
  controllers: [ProviderController],
})
export class ProviderModule {}
