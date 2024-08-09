import { Injectable, BadRequestException, UnauthorizedException,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from '../shared/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Provider } from 'src/provider/provider.schema';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { writeFileSync } from 'fs';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Provider.name) private providerModel: Model<Provider>, 
    private configService: ConfigService,
  ) {}

  async signup(createUserDto: any): Promise<User> {
    const { email, name, password } = createUserDto;
    const existingUser = await this.userModel.findOne({ email }).exec();
    const existingProvider= await this.providerModel.findOne({email}).exec()
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }
    if (existingProvider) {
      throw new BadRequestException('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    }); 

    return newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async login(loginDto: any): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email }).exec();

    if (user) {
      // Check user password
      if (!(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
      
      // Generate JWT token for user
      const token = jwt.sign({ userId: user._id }, this.configService.get<string>('JWT_SECRET'), { expiresIn: '1h' });
      return { token };
    } else {
      // If no user found, check for provider
      const provider = await this.providerModel.findOne({ email }).exec();
      if (!provider || !(await bcrypt.compare(password, provider.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
      
      // Generate JWT token for provider
      const token = jwt.sign({ providerId: provider._id }, this.configService.get<string>('JWT_SECRET'), { expiresIn: '1h' });
      return { token };
    }
  }
  async getdata(id:any,userType:any): Promise<User | null>{
    let user;
    if (userType === 'user') {
      user = await this.userModel.findById(id).exec();
    } else if (userType === 'provider') {
      user = await this.providerModel.findById(id).exec();
    }
    if (!user) {
      throw new NotFoundException(`${userType} not found`);
    }
    return user
  }
  async getAllProviders(): Promise<Provider[]> {
    try {
      const providers = await this.providerModel.find()
        .populate('profile')
        .populate('services')
        .populate('availabilities')
        .populate('events')
        .populate('requests')
        .exec();
      
      return providers;
    } catch (error) {
      throw new BadRequestException('Error fetching providers');
    }
  }

  async getProviderData(providerId: string): Promise<Provider> {
    try {
      const provider = await this.providerModel.findById(providerId)
        .populate('events')
        .populate('requests')
        .populate('availabilities')
        .exec();

      if (!provider) {
        throw new NotFoundException('Provider not found');
      }

      return provider;
    } catch (error) {
      throw new BadRequestException('Error fetching provider data');
    }
  }
  async updateAvatar(userId: string, providerId: string, file: Express.Multer.File): Promise<User | Provider> {
    let userOrProvider;
    let entityType;

    if (userId) {
      userOrProvider = await this.userModel.findById(userId).exec();
      entityType = 'user';
    } else if (providerId) {
      userOrProvider = await this.providerModel.findById(providerId).exec();
      entityType = 'provider';
    }

    if (!userOrProvider) {
      throw new NotFoundException('User or Provider not found');
    }

    const filename = `${uuidv4()}-${file.originalname}`;
    const filePath = join(__dirname, '..', '..', 'uploads', filename);
    writeFileSync(filePath, file.buffer);

    userOrProvider.avatar = `uploads/${filename}`;
    await userOrProvider.save();

    return userOrProvider;
  }
} 
