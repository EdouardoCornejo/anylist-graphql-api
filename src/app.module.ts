import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      // playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    ItemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
