// src/payment/payment.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentSchema } from './payment.schema'; // Import the Payment schema
import { Provider, ProviderSchema } from 'src/provider/provider.schema';
import { User, UserSchema } from 'src/user/user.schema';
import { ProviderModule } from 'src/provider/provider.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Payment', schema: PaymentSchema },
      { name: Provider.name, schema: ProviderSchema },
      {name:User.name, schema:UserSchema},
    ]),
    ProviderModule,
    UserModule,
    HttpModule, // Add HttpModule here
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
