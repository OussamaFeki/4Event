// src/availability/availability.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { DayOfWeek } from '../shared/enums/day-of-week.enum'; // Adjust the import as per your structure
import { Provider } from 'src/provider/provider.schema';

@Schema()
export class Availability extends Document {
  @Prop({ required: true })
  dayOfWeek: DayOfWeek;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Provider', required: true })
  provider: Provider;

  @Prop({ required: true })
  startTime: string; // Example: '09:00'

  @Prop({ required: true })
  endTime: string; // Example: '17:00'

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability);
