// src/notification/notification.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Notification extends Document {
  @Prop({ required: true, unique: true })
  notificationID: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  sentAt: Date;

  @Prop({ required: true })
  method: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
