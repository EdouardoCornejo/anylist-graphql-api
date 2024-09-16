import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import {
  Args,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { CurrentUser } from 'src/core/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/core/auth/enums/valid-roles.enum';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { Item } from 'src/core/items/entities/item.entity';
import { ItemsService } from 'src/core/items/items.service';
import { List } from 'src/core/lists/entities/list.entity';
import { ListsService } from 'src/core/lists/lists.service';
import { ValidRolesArgs } from 'src/core/users/dto/args/roles.args';
import { UpdateUserInput } from 'src/core/users/dto/inputs/update-user.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemService: ItemsService,
    private readonly listsService: ListsService,
  ) {}

  @Query(() => [User], { name: 'findAllUsers' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser([ValidRoles.ADMIN]) user: User,
  ): Promise<Array<User>> {
    return this.usersService.findAll(
      validRoles.roles,
      paginationArgs,
      searchArgs,
    );
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

  @ResolveField(() => Int, { name: 'itemCount' })
  async itemCount(
    @CurrentUser([ValidRoles.ADMIN]) adminUser: User,
    @Parent() user: User,
  ): Promise<number> {
    return this.itemService.itemCountByUser(user);
  }

  @ResolveField(() => [Item], { name: 'items' })
  async getItemsByUser(
    @CurrentUser([ValidRoles.ADMIN]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Array<Item>> {
    return this.itemService.findAll(user, paginationArgs, searchArgs);
  }

  //LIST
  @ResolveField(() => Int, { name: 'listCount' })
  async listCount(
    @CurrentUser([ValidRoles.ADMIN]) adminUser: User,
    @Parent() user: User,
  ): Promise<number> {
    return this.listsService.listCountByUser(user);
  }

  @ResolveField(() => [List], { name: 'list' })
  async getListByUser(
    @CurrentUser([ValidRoles.ADMIN]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Array<List>> {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }
}
