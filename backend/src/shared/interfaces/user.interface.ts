// src/shared/interfaces/user.interface.ts

import { Document } from 'mongoose';
import { Profile } from '../../profile/profile.schema';

export interface User extends Document {
  readonly userID: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly profile: Profile;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
