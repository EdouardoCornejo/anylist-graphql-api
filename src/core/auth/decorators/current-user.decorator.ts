import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from 'src/core/auth/enums/valid-roles.enum';
import { User } from 'src/core/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (roles: Array<ValidRoles> = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user: User = ctx.getContext().req.user;

    if (!user) {
      throw new InternalServerErrorException('No user inside request');
    }

    if (!roles.length) {
      return user;
    }

    for (const role of user.roles) {
      if (roles.includes(role as ValidRoles)) {
        return user;
      }
    }

    throw new ForbiddenException(
      `User does not have the required role [${roles}] `,
    );
  },
);
