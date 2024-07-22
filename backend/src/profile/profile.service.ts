import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import { Provider } from '../provider/provider.schema';
import { Profile } from '../profile/profile.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Provider.name) private providerModel: Model<Provider>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  async updateProfile(userId: string, updateProfileDto: any, userType: 'user' | 'provider'): Promise<any> {
    let user;
    if (userType === 'user') {
      user = await this.userModel.findById(userId).exec();
    } else if (userType === 'provider') {
      user = await this.providerModel.findById(userId).exec();
    }

    if (!user) {
      throw new NotFoundException(`${userType} not found`);
    }

    let profile;
    if (!user.profile) {
      profile = new this.profileModel(updateProfileDto);
      await profile.save();
      user.profile = profile._id;
    } else {
      profile = await this.profileModel.findById(user.profile).exec();
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }
      await profile.updateOne(updateProfileDto).exec();
      profile = await this.profileModel.findById(user.profile).exec(); // Fetch updated profile
    }

    user.updatedAt = new Date();
    await user.save();

    return {
      ...user.toObject(),
      profile: profile.toObject()
    };
  }
  async hasProfile(userId: string, userType: 'user' | 'provider'): Promise<boolean> {
    let user;
    if (userType === 'user') {
      user = await this.userModel.findById(userId).exec();
    } else if (userType === 'provider') {
      user = await this.providerModel.findById(userId).exec();
    }
  
    if (!user) {
      throw new NotFoundException(`${userType} not found`);
    }
  
    return !!user.profile;
  }
}
