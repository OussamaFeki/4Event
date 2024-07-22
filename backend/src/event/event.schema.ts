// src/event/event.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/user.schema';
import { Provider } from '../provider/provider.schema';
import { Payment } from '../payment/payment.schema';

@Schema()
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  organizer: User;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Provider' }] })
  providers: Provider[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Provider' }] })
  requests: Provider[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Payment' })
  payment: Payment;
  @Prop({ required: true })
  location: string;
  @Prop({ required: true })
  startTime: string; // Example: '09:00'

  @Prop({ required: true }) 
  endTime: string; // Example: '17:00'
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}


export const EventSchema = SchemaFactory.createForClass(Event);

