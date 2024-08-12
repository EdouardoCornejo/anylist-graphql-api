import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from 'src/core/items/items.module';
import { UsersModule } from 'src/core/users/users.module';

@Module({
  imports: [ConfigModule, ItemsModule, UsersModule],
  providers: [SeedResolver, SeedService],
})
export class SeedModule {}
