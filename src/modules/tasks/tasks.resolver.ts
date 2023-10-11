import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { PaginatedTasks, Task } from './dto/task.dto';
import { CreateTaskInput, TaskInput, UpdateTaskInput } from './dto/tasks.input';

@Resolver(() => Task)
export class TasksResolver {
  public constructor(private readonly tasksService: TasksService) {}

  @Query(() => Task, { name: 'task' })
  public findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tasksService.findOne(id);
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
