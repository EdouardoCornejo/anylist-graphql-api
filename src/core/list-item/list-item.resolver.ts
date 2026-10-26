import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/core/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { UpdateListItemInput } from 'src/core/list-item/dto/update-list-item.input';
import { User } from 'src/core/users/entities/user.entity';
import { CreateListItemInput } from './dto/create-list-item.input';
import { ListItem } from './entities/list-item.entity';
import { ListItemService } from './list-item.service';

@Resolver(() => ListItem)
@UseGuards(JwtAuthGuard)
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) {}

  @Mutation(() => ListItem, {
    description:
      "Add one of the authenticated user's items to one of their lists.",
  })
  createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput,
    @CurrentUser() user: User,
  ): Promise<ListItem> {
    return this.listItemService.create(createListItemInput, user);
  }

  @Query(() => ListItem, {
    name: 'listItem',
    description: "Get an entry of one of the authenticated user's lists by id.",
  })
  findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<ListItem> {
    return this.listItemService.findOne(id, user);
  }

  @Mutation(() => ListItem, {
    description:
      "Update an entry of one of the authenticated user's lists; only the fields sent change.",
  })
  updateListItem(
    @Args('updateListItemInput') updateListItemInput: UpdateListItemInput,
    @CurrentUser() user: User,
  ): Promise<ListItem> {
    return this.listItemService.update(
      updateListItemInput.id,
      updateListItemInput,
      user,
    );
  }
}
