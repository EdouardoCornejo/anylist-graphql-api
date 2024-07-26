import { Injectable } from '@nestjs/common';
import { User } from 'src/core/users/entities/user.entity';

@Injectable()
export class UsersService {
  findAll(): Promise<Array<User>> {
    return Promise.resolve([]);
  }

  findOne(id: string): Promise<User> {
    console.log('🚀 ~ UsersService ~ findOne ~ id:', id);
    throw new Error('Method not implemented.');
  }

  block(id: string) {
    console.log('🚀 ~ UsersService ~ block ~ id:', id);
    throw new Error('Method not implemented.');
  }
}
