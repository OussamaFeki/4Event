import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './client.schema';
import { MessageService } from '../message/message.service'; // Assuming MessageService is in the 'message' folder
import { User } from 'src/user/user.schema';
import { Profile } from 'src/profile/profile.schema';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Profile.name) private ProfielModel: Model<User>,
    private readonly messageService: MessageService, // Inject the MessageService
  ) {}

  async createClient(createClientDto: any, userId: any, message: any): Promise<Client> {
    const { email, name, phone } = createClientDto;

    // Check if a client with the same email already exists
    const existingClient = await this.clientModel.findOne({ email }).exec();

    if (existingClient) {
      // Create a message if the client already exists
      const messageDto: any = {
        sender: existingClient._id,
      };

      await this.messageService.createMessage(messageDto.sender, userId, message);

      throw new ConflictException('Client with this email already exists. A message has been sent.');
    }

    // Create a new client if it doesn't exist
    const newClient = new this.clientModel(createClientDto);
    return await newClient.save();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find()
      .select('-password') // Exclude the password field for security
      .populate({
        path: 'profile',
        model: this.ProfielModel, // Use the injected ProfileModel
        select: '-__v' // Exclude the version key if you don't need it
      })
      .lean() // Convert documents to plain JavaScript objects for better performance
      .exec();
  }
}
