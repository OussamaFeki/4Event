import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async createMessage(senderId: any, receiverId: string, content: string): Promise<Message> {
    const newMessage = new this.messageModel({
      sender: senderId,
      receiver: receiverId,
      content,
    });
    return newMessage.save();
  }

  async findMessagesForReceiver(receiverId: string): Promise<Message[]> {
    return this.messageModel.find({ receiver: receiverId }) .populate('sender', 'name email phone').exec();
  }

  async deleteMessage(id: string): Promise<void> {
    const result = await this.messageModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Message not found');
    }
  }
}
