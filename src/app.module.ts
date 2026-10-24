/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { GraphQLFormattedError } from 'graphql';
import { join } from 'path';
import { EnvConfig } from 'src/common/config/env.config';
import { JoiValidationSchema } from 'src/common/config/joi.schema-validation';
import { AuthModule } from 'src/core/auth/auth.module';
import { UsersModule } from 'src/core/users/users.module';
import { ItemsModule } from './core/items/items.module';
import { ListItemModule } from './core/list-item/list-item.module';
import { ListsModule } from './core/lists/lists.module';
import { SeedModule } from './core/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfig],
      validationSchema: JoiValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        database: configService.get<string>('DB_NAME'),
        username: configService.get<string>('DB_USER_NAME'),
        password: configService.get<string>('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService, ConfigService],
      useFactory: async (
        jwtService: JwtService,
        configService: ConfigService,
      ) => ({
        playground: false,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        // Apollo Sandbox is a development tool: only served outside production.
        plugins:
          configService.get<string>('STATE') === 'prod'
            ? []
            : [ApolloServerPluginLandingPageLocalDefault()],
        // Nest only maps 400/401/403 to GraphQL codes, so a 404 would
        // otherwise surface as INTERNAL_SERVER_ERROR.
        formatError: (formattedError: GraphQLFormattedError) => {
          const originalError = formattedError.extensions?.originalError as
            | { statusCode?: number }
            | undefined;
          if (originalError?.statusCode !== 404) return formattedError;

          return {
            ...formattedError,
            extensions: { ...formattedError.extensions, code: 'NOT_FOUND' },
          };
        },
        context({ req }) {
          // const token = req.headers.authorization?.replace('Bearer ', '') || '';
          // if (!token) throw new Error('No token found');
          // const payload = jwtService.decode(token);
          // if (!payload) throw new Error('Token not valid');
        },
      }),
    }),

    //*Basic configuration
    // GraphQLModule.forRoot({
    //   driver: ApolloDriver,
    //   // playground: false,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   playground: false,
    //   plugins: [ApolloServerPluginLandingPageLocalDefault()],
    // }),
    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    ListsModule,
    ListItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
