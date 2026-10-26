import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Item } from 'src/core/items/entities/item.entity';
import { User } from 'src/core/users/entities/user.entity';
import { List } from './../lists/entities/list.entity';
import { ListItem } from './entities/list-item.entity';

import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>,

    @InjectRepository(List)
    private readonly listsRepository: Repository<List>,

    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async create(
    createListItemInput: CreateListItemInput,
    user: User,
  ): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;
    await this.assertOwnedRelations({ listId, itemId }, user);

    const newListItem = this.listItemsRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId },
    });

    await this.listItemsRepository.save(newListItem);

    return this.findOne(newListItem.id, user);
  }

  async findAll(
    list: List,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listItemsRepository
      .createQueryBuilder('listItem') // <-- Nombre para las relaciones
      .innerJoin('listItem.item', 'item') // <--- Lo añadí después, fue un problema que no grabé
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, { listId: list.id });

    if (search) {
      queryBuilder.andWhere('LOWER(item.name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }

    return queryBuilder.getMany();
  }

  async countListItemsByList(list: List): Promise<number> {
    return this.listItemsRepository.count({
      where: { list: { id: list.id } },
    });
  }

  async findOne(id: string, user: User): Promise<ListItem> {
    const listItem = await this.listItemsRepository.findOneBy({
      id,
      list: { user: { id: user.id } },
    });

    if (!listItem)
      throw new NotFoundException(`List item with id ${id} not found`);

    return listItem;
  }

  async update(
    id: string,
    updateListItemInput: UpdateListItemInput,
    user: User,
  ): Promise<ListItem> {
    const { listId, itemId, ...rest } = updateListItemInput;
    await this.findOne(id, user);
    await this.assertOwnedRelations({ listId, itemId }, user);

    // A single set() call: each set() replaces the previous values.
    await this.listItemsRepository
      .createQueryBuilder()
      .update()
      .set({
        ...rest,
        ...(listId && { list: { id: listId } }),
        ...(itemId && { item: { id: itemId } }),
      })
      .where('id = :id', { id })
      .execute();

    return this.findOne(id, user);
  }

  // Lists and items of other users answer the same "not found" as missing
  // ids, so a caller can't confirm that someone else's id exists.
  private async assertOwnedRelations(
    { listId, itemId }: { listId?: string; itemId?: string },
    user: User,
  ): Promise<void> {
    const owner = { user: { id: user.id } };
    const [listOwned, itemOwned] = await Promise.all([
      !listId || this.listsRepository.existsBy({ id: listId, ...owner }),
      !itemId || this.itemsRepository.existsBy({ id: itemId, ...owner }),
    ]);

    if (!listOwned || !itemOwned) {
      throw new NotFoundException('List or item not found');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
