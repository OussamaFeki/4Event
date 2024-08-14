import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';

import { Request } from 'express';
import { AuthGuard } from 'src/shared/auth/auth.gard';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AuthGuard)
  @Get('my-messages')
  async getMyMessages(@Req() req: Request) {
    const userId = req['user'].userId; // Assuming `req.user` contains the authenticated user's info
    return this.messageService.findMessagesForReceiver(userId);
  }
}
