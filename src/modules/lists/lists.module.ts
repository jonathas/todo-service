import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lists } from './lists.entity';
import { ListsResolver } from './lists.resolver';
import { ListsService } from './lists.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lists])],
  providers: [ListsResolver, ListsService]
})
export class ListsModule {}
