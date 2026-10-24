import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/core/users/entities/user.entity';

@ObjectType({ description: 'A signed JWT and the authenticated user.' })
export class AuthResponse {
  @Field(() => String, {
    description: 'JWT to send as the header Authorization: Bearer <token>.',
  })
  token: string;

  @Field(() => User, { description: 'Authenticated user.' })
  user: User;
}
