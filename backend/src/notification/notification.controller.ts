// src/notification/notification.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';


@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async createNotification(@Body() createNotificationDto: any) {
    return this.notificationService.createNotification(createNotificationDto);
  }

  // Add other routes as needed
}
