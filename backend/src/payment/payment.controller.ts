// src/payment/payment.controller.ts

import { Controller, Post, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { User } from '../user/user.schema';
import { Provider } from '../provider/provider.schema';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  // Route to initiate a payment session
  @Post('create')
  async processPayment(
    @Body('amount') amount: number,
    @Body('user') user: string,
    @Body('provider') provider: string
  ) {
    const payment = await this.paymentService.createPaymentSession(amount, user, provider);
    return {
      successLink: payment.successLink,
      failLink: payment.failLink,
      clientSecret: payment.clientSecret,
    };
  }

  // Route to confirm the payment based on clientSecret
  @Post('confirm/:clientSecret')
  async confirmPayment(@Param('clientSecret') clientSecret: string) {
    const payment = await this.paymentService.confirmPayment(clientSecret);
    return {
      message: 'Payment status updated',
      status: payment.status,
    };
  }
}
