import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, SignUpInput } from 'src/core/auth/dto/input';
import { AuthResponse } from 'src/core/auth/types/auth-response.type';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/core/auth/decorators/current-user.decorator';
import { User } from 'src/core/users/entities/user.entity';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, {
    name: 'signUp',
    description: 'Register a new user and return a JWT.',
  })
  signUp(@Args('signUpInput') signUpInput: SignUpInput): Promise<AuthResponse> {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => AuthResponse, {
    name: 'login',
    description: 'Log in with email and password and return a JWT.',
  })
  login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Query(() => AuthResponse, {
    name: 'revalidateToken',
    description: 'Issue a fresh JWT for the authenticated user.',
  })
  @UseGuards(JwtAuthGuard)
  revalidateToken(@CurrentUser() user: User): AuthResponse {
    return this.authService.revalidateToken(user);
  }
}
