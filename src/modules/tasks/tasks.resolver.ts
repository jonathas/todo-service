import { Args, Query, Resolver } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { PaginatedTasks, Task } from './dto/task.dto';
import { TaskInput } from './dto/tasks.input';

@Resolver(() => Task)
export class TasksResolver {
  public constructor(private readonly tasksService: TasksService) {}

  // TODO: Add a query to get a task by ID

  // TODO: Add a query to get all tasks

  // TODO: Add a mutation to create a task

  // TODO: Add a mutation to update a task

  // TODO: Add a mutation to delete a task

  @Query(() => PaginatedTasks, { name: 'tasks' })
  public findAll(@Args('input') input: TaskInput): Promise<PaginatedTasks> {
    return this.tasksService.findAll(input);
  }
}
