import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from 'src/core/users/dto/args/roles.args';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/core/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/core/auth/enums/valid-roles.enum';
import { UpdateUserInput } from 'src/core/users/dto/inputs/update-user.input';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'findAllUsers' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser([ValidRoles.ADMIN]) user: User,
  ): Promise<Array<User>> {
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'findOneUser' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.SUPER_USER]) user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.SUPER_USER]) user: User,
  ) {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User)
  blockUser(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.ADMIN, ValidRoles.SUPER_USER]) user: User,
  ) {
    return this.usersService.block(id, user);
  }
}
