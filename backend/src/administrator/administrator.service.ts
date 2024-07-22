import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Administrator } from './administrator.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AdministratorService {
  constructor(
    @InjectModel(Administrator.name) private administratorModel: Model<Administrator>,
  ) {}

  async signup(createAdministratorDto: any): Promise<Administrator> {
    const { email, password } = createAdministratorDto;
    const existingAdmin = await this.administratorModel.findOne({ email }).exec();

    if (existingAdmin) {
      throw new BadRequestException('Administrator with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new this.administratorModel({
      ...createAdministratorDto,
      password: hashedPassword,
    });

    return newAdmin.save();
  }

  async findByEmail(email: string): Promise<Administrator | null> {
    return this.administratorModel.findOne({ email }).exec();
  }

  async login(loginDto: any): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const admin = await this.administratorModel.findOne({ email }).exec();

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign({ adminId: admin._id }, 'your_secret_key', { expiresIn: '1h' });
    
    return { token };
  }
}
