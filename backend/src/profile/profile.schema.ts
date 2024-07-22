// src/profile/profile.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Profile extends Document {
  @Prop()
  address: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  bio: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
