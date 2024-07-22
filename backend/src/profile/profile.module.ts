import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './profile.schema';
import { User, UserSchema } from '../user/user.schema';
import { Provider, ProviderSchema } from '../provider/provider.schema';
import { AuthGuard } from '../shared/auth/auth.gard';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Provider.name, schema: ProviderSchema }]),
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
  controllers: [ProfileController],
  providers: [ProfileService, AuthGuard],
})
export class ProfileModule {}

