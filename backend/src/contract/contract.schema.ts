// src/contract/contract.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Event } from '../event/event.schema'; // Adjust the import as per your structure
import { Provider } from '../provider/provider.schema'; // Adjust the import as per your structure

@Schema()
export class Contract extends Document {
  @Prop({ type: Event, required: true })
  event: Event;

  @Prop({ type: Provider, required: true })
  provider: Provider;

  @Prop({ required: true })
  terms: string;
  @Prop({ required: true })
  price: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
