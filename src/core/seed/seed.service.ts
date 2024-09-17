import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/core/items/entities/item.entity';
import { ItemsService } from 'src/core/items/items.service';
import { ListItem } from 'src/core/list-item/entities/list-item.entity';
import { ListItemService } from 'src/core/list-item/list-item.service';
import { List } from 'src/core/lists/entities/list.entity';
import { ListsService } from 'src/core/lists/lists.service';
import {
  SEED_ITEMS,
  SEED_LISTS,
  SEED_USERS,
} from 'src/core/seed/data/seed-data';
import { User } from 'src/core/users/entities/user.entity';
import { UsersService } from 'src/core/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,

    @InjectRepository(List)
    private readonly listRepository: Repository<List>,

    private readonly usersService: UsersService,

    private readonly itemsService: ItemsService,

    private readonly listService: ListsService,
    private readonly listItemService: ListItemService,
  ) {
    this.isProd = this.configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    //check if we are in production
    if (this.isProd) {
      throw new UnauthorizedException(
        'You are not allowed to do this in production',
      );
    }

    //delete all data
    await this.deleteDatabase();

    //create users
    const user = await this.loadUsers();

    //create items
    await this.loadItems(user);

    //create lists
    const list = await this.loadLists(user);

    //create list-items
    const items = await this.itemsService.findAll(
      user,
      {
        limit: 15,
        offset: 0,
      },
      {},
    );
    await this.loadListItems(list, items);
    return true;
  }

  async deleteDatabase(): Promise<void> {
    //delete List-items
    await this.listItemRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    //delete List
    await this.listRepository.createQueryBuilder().delete().where({}).execute();

    //delete items
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    //delete Users
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User> {
    const users = [];

    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }

    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    const itemsPromises = [];
    for (const item of SEED_ITEMS) {
      itemsPromises.push(await this.itemsService.create(item, user));
    }

    await Promise.all(itemsPromises);
  }

  async loadLists(user: User): Promise<List> {
    const lists = [];

    for (const list of SEED_LISTS) {
      lists.push(await this.listService.create(list, user));
    }

    return lists[0];
  }

  async loadListItems(list: List, items: Array<Item>): Promise<void> {
    for (const item of items) {
      this.listItemService.create({
        quantity: Math.round(Math.random() * 10),
        completed: Boolean(Math.round(Math.random() * 1)),
        listId: list.id,
        itemId: item.id,
      });
    }
  }
}
