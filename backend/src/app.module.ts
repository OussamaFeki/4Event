import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { AdministratorModule } from './administrator/administrator.module';
import { ProviderModule } from './provider/provider.module';
import { ServiceModule } from './service/service.module';
import { AvailabilityModule } from './availability/availability.module';
import { EventModule } from './event/event.module';
import { PaymentModule } from './payment/payment.module';
import { ContractModule } from './contract/contract.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        retryAttempts: 10,
        retryDelay: 3000,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProfileModule,
    AdministratorModule,
    ProviderModule,
    ServiceModule,
    AvailabilityModule,
    EventModule,
    PaymentModule,
    ContractModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

