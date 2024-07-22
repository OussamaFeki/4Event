import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Availability, AvailabilitySchema } from './availability.schema';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { Provider, ProviderSchema } from '../provider/provider.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/shared/auth/auth.gard';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Availability.name, schema: AvailabilitySchema },
      { name: Provider.name, schema: ProviderSchema }
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
    ConfigModule,
  ],
  providers: [AvailabilityService, AuthGuard],
  controllers: [AvailabilityController],
  exports: [AvailabilityService, AuthGuard],
})
export class AvailabilityModule {}
