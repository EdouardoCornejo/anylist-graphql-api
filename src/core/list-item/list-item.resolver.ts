import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { UpdateListItemInput } from 'src/core/list-item/dto/update-list-item.input';
import { CreateListItemInput } from './dto/create-list-item.input';
import { ListItem } from './entities/list-item.entity';
import { ListItemService } from './list-item.service';

@Resolver(() => ListItem)
@UseGuards(JwtAuthGuard)
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) {}

  @Mutation(() => ListItem, { description: 'Add an item to a list.' })
  createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput,
  ): Promise<ListItem> {
    return this.listItemService.create(createListItemInput);
  }

  @Query(() => ListItem, {
    name: 'listItem',
    description: 'Get a list entry by id.',
  })
  findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
  ): Promise<ListItem> {
    return this.listItemService.findOne(id);
  }

  @Mutation(() => ListItem, {
    description: 'Update a list entry; only the fields sent are changed.',
  })
  updateListItem(
    @Args('updateListItemInput') updateListItemInput: UpdateListItemInput,
  ): Promise<ListItem> {
    return this.listItemService.update(
      updateListItemInput.id,
      updateListItemInput,
    );
  }
}
