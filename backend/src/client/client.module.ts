import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client, ClientSchema } from './client.schema';
import { Message, MessageSchema } from 'src/message/message.schema';
import { MessageService } from 'src/message/message.service';
import { User, UserSchema } from 'src/user/user.schema';
import { Profile, ProfileSchema } from 'src/profile/profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  providers: [ClientService, MessageService],
  controllers: [ClientController],
})
export class ClientModule {}
