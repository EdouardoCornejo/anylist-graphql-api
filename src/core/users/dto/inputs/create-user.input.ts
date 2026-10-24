import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType({ description: 'Data to create a user.' })
export class CreateUserInput {
  @Field(() => String, { description: 'Email address; must be unique.' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Full name.' })
  @IsNotEmpty()
  fullName: string;

  @Field(() => String, { description: 'Password, at least 6 characters.' })
  @MinLength(6)
  password: string;
}
