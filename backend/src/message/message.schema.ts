import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import { Client } from 'src/client/client.schema';
import { User } from 'src/user/user.schema';

@Schema()
export class Message extends Document {
  @Prop({ required: true,type:mongoose.Schema.Types.ObjectId,ref:'Client' })
  sender: Client;

  @Prop({ required: true,type:mongoose.Schema.Types.ObjectId,ref:'User' })
  receiver: User;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
