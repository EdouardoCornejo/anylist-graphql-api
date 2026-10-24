import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    const user = await this.usersService.findOneById(id).catch(() => null);
    if (!user) {
      throw new UnauthorizedException('Token not valid');
    }

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
    // Same error for unknown email and wrong password, so emails can't be probed.
    const user = await this.usersService
      .findOneByEmail(email)
      .catch(() => null);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
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
