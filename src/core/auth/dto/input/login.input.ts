import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType({ description: 'Credentials to log in.' })
export class LoginInput {
  @Field(() => String, { description: 'Registered email address.' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Password, at least 6 characters.' })
  @MinLength(6)
  password: string;
}
