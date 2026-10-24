import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { CurrentUser } from 'src/core/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { ListItem } from 'src/core/list-item/entities/list-item.entity';
import { ListItemService } from 'src/core/list-item/list-item.service';
import { User } from 'src/core/users/entities/user.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { List } from './entities/list.entity';
import { ListsService } from './lists.service';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listItemService: ListItemService,
  ) {}

  @Mutation(() => List, {
    description: 'Create a list for the authenticated user.',
  })
  async createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => [List], {
    name: 'lists',
    description:
      "List the authenticated user's lists, paginated and searchable by name.",
  })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Array<List>> {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => List, {
    name: 'list',
    description: "Get one of the authenticated user's lists by id.",
  })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List, {
    description: "Rename one of the authenticated user's lists.",
  })
  updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user: User,
  ) {
    return this.listsService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List, {
    description: "Delete one of the authenticated user's lists.",
  })
  removeList(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.listsService.remove(id, user);
  }

  @ResolveField(() => [ListItem], {
    name: 'items',
    description: 'Entries of the list, paginated and searchable by item name.',
  })
  async getListItems(
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    return this.listItemService.findAll(list, paginationArgs, searchArgs);
  }

  @ResolveField(() => Number, {
    name: 'totalItems',
    description: 'Total number of entries in the list.',
  })
  async countListItemsByList(@Parent() list: List): Promise<number> {
    return this.listItemService.countListItemsByList(list);
  }
}
