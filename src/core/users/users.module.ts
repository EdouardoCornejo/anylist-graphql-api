import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/core/users/entities/user.entity';
import { ItemsModule } from 'src/core/items/items.module';
import { ListsModule } from 'src/core/lists/lists.module';

@Module({
  providers: [UsersResolver, UsersService, Logger],
  imports: [TypeOrmModule.forFeature([User]), ItemsModule, ListsModule],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
