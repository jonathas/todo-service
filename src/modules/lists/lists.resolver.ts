import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ListsService } from './lists.service';
import { List, ListDetails, PaginatedLists } from './dto/list.dto';
import { CreateListInput, ListInput, UpdateListInput } from './dto/lists.input';
import { Task } from '../tasks/dto/task.dto';
import { TasksService } from '../tasks/tasks.service';

@Resolver(() => ListDetails)
export class ListsResolver {
  public constructor(
    private readonly listsService: ListsService,
    private readonly tasksService: TasksService
  ) {}

  @Query(() => ListDetails, { name: 'list' })
  public findOne(@Args('id', { type: () => Int }) id: number) {
    return this.listsService.findOne(id);
  }

  @ResolveField(() => [Task])
  public tasks(@Parent() list: List) {
    return this.tasksService.findAllByListId(list.id);
  }

  @Query(() => PaginatedLists, { name: 'lists' })
  public findAll(@Args('input') input: ListInput): Promise<PaginatedLists> {
    return this.listsService.findAll(input);
  }

  @Mutation(() => List)
  public createList(@Args('input') input: CreateListInput) {
    return this.listsService.create(input);
  }

  @Mutation(() => List)
  public updateList(@Args('input') input: UpdateListInput) {
    return this.listsService.update(input);
  }

  @Mutation(() => List)
  public deleteList(@Args('id', { type: () => Int }) id: number) {
    return this.listsService.delete(id);
  }
}
