import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { DatabaseModule } from './providers/sql/database.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Environments } from './shared/enums';
import { ListsModule } from './modules/lists/lists.module';
import generalConfig from './config/general.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [generalConfig, databaseConfig],
      cache: true
    }),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: process.env.NODE_ENV !== Environments.PRODUCTION
    }),
    TasksModule,
    ListsModule
  ],
  providers: []
})
export class AppModule {}
