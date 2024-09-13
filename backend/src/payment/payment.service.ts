import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './payment.schema';
import { User } from '../user/user.schema';
import { Provider } from '../provider/provider.schema';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  private readonly flouciApiUrl = 'https://developers.flouci.com/api/generate_payment';

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Provider.name) private providerModel: Model<Provider>,
    @InjectModel(User.name) private userModel: Model<User>,
    private httpService: HttpService,
  ) {}

  // Create a payment session using Flouci API
  async createPaymentSession(amount: number, userId: string, providerId: string): Promise<any> {
    const clientSecret = this.generateClientSecret();
    
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const provider = await this.providerModel.findById(providerId).exec();
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const payload = {
      app_token: process.env.FLOUCI_APP_TOKEN,
      app_secret: process.env.FLOUCI_APP_SECRET,
      accept_card: 'true',
      amount: amount.toString(),
      session_timeout_secs: 1200,
      success_link: 'https://example.website.com/success',
      fail_link: 'https://example.website.com/fail',
      developer_tracking_id: clientSecret,
    };

    const response: AxiosResponse = await firstValueFrom(
      this.httpService.post(this.flouciApiUrl, payload)
    );

    // Save the payment in the database with status "pending"
    const createdPayment = new this.paymentModel({
      amount,
      date: new Date(),
      method: 'flouci',
      status: 'pending',
      clientSecret: clientSecret, // Secure the payment with a clientSecret
      user: user._id,
      provider: provider._id,
    });

    await createdPayment.save();

    // Return the success and failure URLs along with clientSecret to the frontend
    return {
      successLink: response.data.success_link,
      failLink: response.data.fail_link,
      clientSecret: clientSecret,
    };
  }

  // Confirm the payment session
  async confirmPayment(clientSecret: string): Promise<Payment> {
    const payment = await this.paymentModel.findOne({ clientSecret });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(`${this.flouciApiUrl}/status`, {
          params: {
            app_token: process.env.FLOUCI_APP_TOKEN,
            clientSecret,
          },
        })
      );

      // Update payment status based on the Flouci response
      if (response.data.status === 'completed') {
        payment.status = 'completed';
      } else if (response.data.status === 'failed') {
        payment.status = 'failed';
      }

      payment.updatedAt = new Date();
      return payment.save();

    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new UnauthorizedException('Invalid API credentials or session expired');
        }
      }
      throw error;
    }
  }
  
  // Generate a unique client secret for security purposes
  private generateClientSecret(): string {
    return `CLIENT_SECRET_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}
