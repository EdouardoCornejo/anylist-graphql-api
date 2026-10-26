import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/core/items/entities/item.entity';
import { List } from 'src/core/lists/entities/list.entity';
import { ListItem } from './entities/list-item.entity';
import { ListItemResolver } from './list-item.resolver';
import { ListItemService } from './list-item.service';

@Module({
  providers: [ListItemResolver, ListItemService],
  imports: [TypeOrmModule.forFeature([ListItem, List, Item])],
  exports: [ListItemService, TypeOrmModule],
})
export class ListItemModule {}
