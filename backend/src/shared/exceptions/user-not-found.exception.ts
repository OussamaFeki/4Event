// src/shared/exceptions/user-not-found.exception.ts

import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(userID: string) {
    super(`User with ID ${userID} not found`);
  }
}
