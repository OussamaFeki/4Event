// src/payment/payment.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';


@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() createPaymentDto: any) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  // Add other routes as needed
}
