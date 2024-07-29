import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, SignUpInput } from 'src/core/auth/dto/input';
import { AuthResponse } from 'src/core/auth/types/auth-response.type';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'signUp' })
  signUp(@Args('signUpInput') signUpInput: SignUpInput): Promise<AuthResponse> {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => AuthResponse, { name: 'login' })
  login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  // @Query(() => String, { name: 'revalidateToken' })
  // revalidateToken(): Promise<any> {
  //   return this.authService.revalidateToken();
  // }
}
