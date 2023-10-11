import { Query, Resolver } from '@nestjs/graphql';
import { TasksService } from './tasks.service';

@Resolver(() => TasksService)
export class TasksResolver {
  public constructor(private readonly tasksService: TasksService) {}

  @Query(() => String)
  public sayHello(): string {
    return 'Hello World!';
  }
}
