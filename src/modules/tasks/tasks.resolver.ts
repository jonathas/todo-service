import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { PaginatedTasks, Task, TaskDetails } from './dto/task.dto';
import { CreateTaskInput, TaskInput, UpdateTaskInput } from './dto/tasks.input';
import { List } from '../lists/dto/list.dto';
import { ListsService } from '../lists/lists.service';

@Resolver(() => TaskDetails)
export class TasksResolver {
  public constructor(
    private readonly tasksService: TasksService,
    private readonly listsService: ListsService
  ) {}

  @Query(() => TaskDetails, { name: 'task' })
  public findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tasksService.findOne(id);
  }

  @ResolveField(() => [List])
  public lists(@Parent() task: Task) {
    return this.listsService.findAllByTaskId(task.id);
  }

  @Query(() => PaginatedTasks, { name: 'tasks' })
  public findAll(@Args('input') input: TaskInput): Promise<PaginatedTasks> {
    return this.tasksService.findAll(input);
  }

  @Mutation(() => Task)
  public createTask(@Args('input') input: CreateTaskInput) {
    return this.tasksService.create(input);
  }

  @Mutation(() => Task)
  public updateTask(@Args('input') input: UpdateTaskInput) {
    return this.tasksService.update(input);
  }

  @Mutation(() => Task)
  public deleteTask(@Args('id', { type: () => Int }) id: number) {
    return this.tasksService.delete(id);
  }
}
