import { Query, Resolver } from '@nestjs/graphql';
import { ListsService } from './lists.service';

@Resolver(() => ListsService)
export class ListsResolver {
  public constructor(private readonly listsService: ListsService) {}

  @Query(() => String)
  public sayHello1(): string {
    return 'Hello World!';
  }
}
