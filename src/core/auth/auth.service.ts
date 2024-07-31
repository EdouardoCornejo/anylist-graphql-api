import {
  BadGatewayException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginInput, SignUpInput } from 'src/core/auth/dto/input';
import { AuthResponse } from 'src/core/auth/types/auth-response.type';
import { User } from 'src/core/users/entities/user.entity';
import { UsersService } from 'src/core/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(userId: string): string {
    return this.jwtService.sign({ id: userId });
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);
    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    delete user.password;

    return user;
  }

  async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signUpInput);

    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;
    const user = await this.usersService.findOneByEmail(email);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new BadGatewayException('Invalid credentials');
    }

    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);
    return {
      token,
      user,
    };
  }
}
