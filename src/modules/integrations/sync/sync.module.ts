import { Module } from '@nestjs/common';
import { SyncFactoryService } from './sync-factory.service';

@Module({
  providers: [SyncFactoryService],
  exports: [SyncFactoryService]
})
export class SyncModule {}
