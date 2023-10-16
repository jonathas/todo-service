import { Mutation, Resolver } from '@nestjs/graphql';
import { SyncService } from './sync.service';

@Resolver()
export class SyncResolver {
  public constructor(private readonly syncService: SyncService) {}

  @Mutation(() => Boolean)
  public startManualSync() {
    return this.syncService.sync();
  }
}
