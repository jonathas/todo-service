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
import microsoftGraphConfig from './config/microsoft-graph.config';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { HttpModule } from './providers/http/http.module';
import { PubSubModule } from './providers/redis/redis-pubsub.module';
import redisConfig from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [generalConfig, databaseConfig, microsoftGraphConfig, redisConfig],
      cache: true
    }),
    DatabaseModule,
    PubSubModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      subscriptions: {
        'graphql-ws': true
      },
      playground: process.env.NODE_ENV !== Environments.PRODUCTION
    }),
    HttpModule,
    TasksModule,
    ListsModule,
    IntegrationsModule
  ],
  providers: []
})
export class AppModule {}
