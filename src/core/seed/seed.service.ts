import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/core/items/entities/item.entity';
import { ItemsService } from 'src/core/items/items.service';
import { SEED_ITEMS, SEED_USERS } from 'src/core/seed/data/seed-data';
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

    private readonly usersService: UsersService,

    private readonly itemsService: ItemsService,
  ) {
    this.isProd = this.configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd) {
      throw new UnauthorizedException(
        'You are not allowed to do this in production',
      );
    }

    await this.deleteDatabase();

    const user = await this.loadUsers();

    await this.loadItems(user);

    // userService

    //create new users
    //create new items

    return true;
  }

  async deleteDatabase(): Promise<void> {
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

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
}
