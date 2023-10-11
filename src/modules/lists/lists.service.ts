import { Injectable } from '@nestjs/common';
import { Lists } from './lists.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ListsService {
  public constructor(
    @InjectRepository(Lists)
    private readonly listsRepository: Repository<Lists>
  ) {}

  public findAll(): Promise<Lists[]> {
    return this.listsRepository.find();
  }
}
