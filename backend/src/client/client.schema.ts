import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Message } from 'src/message/message.schema';

@Schema()
export class Client extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;
  
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
  messages: Message[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
