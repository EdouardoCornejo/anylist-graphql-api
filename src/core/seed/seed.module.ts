import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from 'src/core/items/items.module';
import { ListItemModule } from 'src/core/list-item/list-item.module';
import { ListsModule } from 'src/core/lists/lists.module';
import { UsersModule } from 'src/core/users/users.module';
import { SeedResolver } from './seed.resolver';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule,
    ItemsModule,
    UsersModule,
    ListsModule,
    ListItemModule,
  ],
  providers: [SeedResolver, SeedService],
})
export class SeedModule {}
