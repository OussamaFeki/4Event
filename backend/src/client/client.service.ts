import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './client.schema';
import { MessageService } from '../message/message.service'; // Assuming MessageService is in the 'message' folder
import { User } from 'src/user/user.schema';
import { Profile } from 'src/profile/profile.schema';
import * as nodemailer from 'nodemailer';
@Injectable()
export class ClientService {
  private transporter: nodemailer.Transporter;
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Profile.name) private ProfielModel: Model<User>,
    private readonly messageService: MessageService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: +process.env.EMAIL_PORT, // Convert port to a number
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });
  }

  async createClient(createClientDto: any, userId: string, message: string): Promise<Client> {
    const { email, name, phone } = createClientDto;

    // Check if a client with the same email already exists
    const existingClient = await this.clientModel.findOne({ email }).exec();

    if (existingClient) {
      // Create a message if the client already exists
      const newMessage = await this.messageService.createMessage(existingClient._id, userId, message);

      // Add the new message to the client's messages array
      existingClient.messages.push(newMessage);
      await existingClient.save();

      // Send an email notification to the user with the client's message
      await this.sendEmailNotification(email, name, message);

      // Return the existing client after adding the message
      return existingClient;
    }

    // Create a new client if it doesn't exist
    const newClient = new this.clientModel({
      name,
      email,
      phone,
      messages: [],
    });

    // Save the new client
    const savedClient = await newClient.save();

    // Create a message for the new client
    const newMessage = await this.messageService.createMessage(savedClient._id, userId, message);

    // Add the new message to the client's messages array
    savedClient.messages.push(newMessage);
    await savedClient.save();

    // Send an email notification to the user with the client's message
    await this.sendEmailNotification(email, name, message);

    return savedClient;
  }

  private async sendEmailNotification(email: string, clientName: string, message: string) {
    const mailOptions = {
      from: `"Your Project Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'New Message Notification',
      text: `${clientName} sent a message to you: ${message}`,
      html: `<p><strong>${clientName}</strong> sent a message to you:</p><p>${message}</p>`, // Customize the email content here
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${email}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
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
