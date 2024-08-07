/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';
import { ItemsModule } from './core/items/items.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/core/users/users.module';
import { AuthModule } from 'src/core/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
      inject: [JwtService],
      useFactory: async (jwtService: JwtService) => ({
        playground: false,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        context({ req }) {
          // const token = req.headers.authorization?.replace('Bearer ', '') || '';
          // if (!token) throw new Error('No token found');
          // const payload = jwtService.decode(token);
          // if (!payload) throw new Error('Token not valid');
        },
      }),
    }),

    //?Basic configuration
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
