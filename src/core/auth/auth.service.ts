import { BadGatewayException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginInput, SignUpInput } from 'src/core/auth/dto/input';
import { AuthResponse } from 'src/core/auth/types/auth-response.type';
import { UsersService } from 'src/core/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signUpInput);

    const token = 'token';

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

    const token = 'token';
    return {
      token,
      user,
    };
  }
}
