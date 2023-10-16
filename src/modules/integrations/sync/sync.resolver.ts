import { Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { SyncService } from './sync.service';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from '../../../providers/redis/redis-pubsub.module';
import { Inject } from '@nestjs/common';
import { Notification } from './dto/notification.dto';
import { SyncOutput } from './dto/sync.output';

@Resolver()
export class SyncResolver {
  public constructor(
    private readonly syncService: SyncService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub
  ) {}

  @Mutation(() => SyncOutput)
  public startManualSync() {
    return this.syncService.sync();
  }

  @Subscription(() => Notification, {
    name: 'notifications'
  })
  public notifications() {
    return this.pubSub.asyncIterator('notifications');
  }
}
