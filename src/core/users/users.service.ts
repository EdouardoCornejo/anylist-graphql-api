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
import { ValidRoles } from 'src/core/auth/enums/valid-roles.enum';
import { UpdateUserInput } from 'src/core/users/dto/inputs/update-user.input';

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

  findAll(roles: ValidRoles[]): Promise<Array<User>> {
    if (!roles.length) return this.usersRepository.find();

    return this.usersRepository
      .createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
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

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    updatedBy: User,
  ): Promise<User> {
    try {
      const user = await this.usersRepository.preload({
        ...updateUserInput,
        id,
      });

      user.lastUpdateBy = updatedBy;

      return this.usersRepository.save(user);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async block(id: string, adminUser: User) {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;

    return await this.usersRepository.save(userToBlock);
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

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDbError({
        code: 'error-001',
        detail: `${id} not found`,
      });
    }
  }
}
