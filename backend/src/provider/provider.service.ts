import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Provider } from './provider.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Event } from 'src/event/event.schema';

@Injectable()
export class ProviderService {
  constructor(
    @InjectModel(Provider.name) private providerModel: Model<Provider>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
  ) {}

  async signup(createProviderDto: any): Promise<Provider> {
    const { email, password } = createProviderDto;
    const existingProvider = await this.providerModel.findOne({ email }).exec();

    if (existingProvider) {
      throw new BadRequestException('Provider with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newProvider = new this.providerModel({
      ...createProviderDto,
      password: hashedPassword,
    });

    return newProvider.save();
  }

  async login(loginDto: any): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const provider = await this.providerModel.findOne({ email }).exec();

    if (!provider || !(await bcrypt.compare(password, provider.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign({ providerId: provider._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token };
  }


}
