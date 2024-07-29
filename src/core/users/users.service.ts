import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpInput } from 'src/core/auth/dto/input';
import { User } from 'src/core/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly logger: Logger = new Logger(UsersService.name),
  ) {}

  async create(signUpInput: SignUpInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signUpInput,
        password: bcrypt.hashSync(signUpInput.password, 10),
      });

      return await this.usersRepository.save(newUser);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  findAll(): Promise<Array<User>> {
    return Promise.resolve([]);
  }

  findOne(id: string): Promise<User> {
    console.log('🚀 ~ UsersService ~ findOne ~ id:', id);
    throw new Error('Method not implemented.');
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleDbError({
        code: 'error-001',
        detail: `${email} not found`,
      });
    }
  }

  block(id: string) {
    console.log('🚀 ~ UsersService ~ block ~ id:', id);
    throw new Error('Method not implemented.');
  }

  private handleDbError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }

    if (error.code === 'error-001') {
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Please contact the administrator');
  }
}
