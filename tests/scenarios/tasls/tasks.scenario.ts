import { NestExpressApplication } from '@nestjs/platform-express';
import { AppTestHelper } from '../../app.integration-tests.helper';
import TasksScenarioHelper from './tasks.scenario.helper';

export default class TasksScenario {
  private app: NestExpressApplication;

  public constructor(app: NestExpressApplication) {
    this.app = app;
  }

  public async createTasks() {
    const variables = {
      input: {
        name: 'Sample task 1',
        description: 'This is a description'
      }
    };

    let id = 0;

    await AppTestHelper.gqlRequest(this.app)
      .send({ query: TasksScenarioHelper.getCreateTaskMutation(), variables })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.createTask).toBeDefined();
        expect(body.data.createTask).toHaveProperty('id');
        expect(body.data.createTask.name).toBe(variables.input.name);
        expect(body.data.createTask.description).toBe(variables.input.description);
        expect(body.data.createTask.isDone).toBe(false);

        id = body.data.createTask.id;
      });

    // TODO: Create task associated with list
    variables.input.name = 'Sample task 2';
    await AppTestHelper.gqlRequest(this.app)
      .send({ query: TasksScenarioHelper.getCreateTaskMutation(), variables })
      .expect(200);

    return id;
  }

  public async updateTask() {
    const id = await this.createTasks();
    const variables = {
      input: {
        id,
        name: 'Sample task (updated)',
        description: 'This is a description (updated)',
        isDone: true
      }
    };

    await AppTestHelper.gqlRequest(this.app)
      .send({ query: TasksScenarioHelper.getUpdateTaskMutation(), variables })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.updateTask).toBeDefined();
        expect(body.data.updateTask.id).toBe(variables.input.id);
        expect(body.data.updateTask.name).toBe(variables.input.name);
        expect(body.data.updateTask.description).toBe(variables.input.description);
        expect(body.data.updateTask.isDone).toBe(true);
      });
  }

  public async listNotDoneTasks() {
    await this.updateTask();

    const variables = {
      input: {
        isDone: false,
        sortBy: 'NAME',
        order: 'ASCENDING',
        limit: 5,
        offset: 0
      }
    };

    await AppTestHelper.gqlRequest(this.app)
      .send({ query: TasksScenarioHelper.getTasksQuery(), variables })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.tasks).toBeDefined();
        expect(body.data.tasks.data.length).toBe(1);
        expect(body.data.tasks.data[0].name).toBe('Sample task 2');
      });
  }

  public async listDoneTasks() {
    await this.updateTask();

    const variables = {
      input: {
        isDone: true,
        sortBy: 'NAME',
        order: 'ASCENDING',
        limit: 5,
        offset: 0
      }
    };

    await AppTestHelper.gqlRequest(this.app)
      .send({ query: TasksScenarioHelper.getTasksQuery(), variables })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.tasks).toBeDefined();
        expect(body.data.tasks.data.length).toBe(1);
        expect(body.data.tasks.data[0].name).toBe('Sample task (updated)');
      });
  }

  public async getTaskById() {
    const id = await this.createTasks();

    await AppTestHelper.gqlRequest(this.app)
      .send({ query: TasksScenarioHelper.getOneTaskQuery(), variables: { id } })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.task).toBeDefined();
        expect(body.data.task.name).toBe('Sample task 1');
      });
  }

  public async deleteTask() {
    const id = await this.createTasks();

    await AppTestHelper.gqlRequest(this.app)
      .send({ query: TasksScenarioHelper.getDeleteTaskMutation(), variables: { id } })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.deleteTask).toBeDefined();
        expect(body.data.deleteTask.name).toBe('Sample task 1');
      });
  }
}
