// src/provider/provider.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Profile } from '../profile/profile.schema';
import { Availability } from '../availability/availability.schema';
import { Service } from 'src/service/service.schema';
import { User } from '../user/user.schema';
import { Event } from 'src/event/event.schema';

@Schema()
export class Provider extends User {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Profile' })
  profile: Profile;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Service' }]})
  services: Service[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Availability' }] })
  availabilities: Availability[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Event' }] })
  events: Event[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Event' }] })
  requests: Event[];

  @Prop()
  price: number;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);
