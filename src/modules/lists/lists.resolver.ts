import { Query, Resolver } from '@nestjs/graphql';
import { ListsService } from './lists.service';

@Resolver(() => ListsService)
export class ListsResolver {
  public constructor(private readonly listsService: ListsService) {}

  // TODO: Add a query to get a list by ID

  // TODO: Add a query to get all lists

  // TODO: Add a mutation to create a list

  // TODO: Add a mutation to update a list

  // TODO: Add a mutation to delete a list

  @Query(() => String)
  public getLists() {
    return this.listsService.findAll();
  }
}
