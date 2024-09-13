// src/payment/payment.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Provider } from '../provider/provider.schema';

@Schema()
export class Payment extends Document {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  status: string; // e.g., 'pending', 'completed', 'failed'

  @Prop({ required: true })
  clientSecret: string; // To securely complete the payment

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User; // The user who is making the payment

  @Prop({ type: Types.ObjectId, ref: 'Provider', required: true })
  provider: Provider; // The provider who is receiving the payment

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
