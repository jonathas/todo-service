import { NestExpressApplication } from '@nestjs/platform-express';
import { AppTestHelper } from '../../app.integration-tests.helper';
import ListsScenarioHelper from './lists.scenario.helper';
import TasksScenario from '../tasls/tasks.scenario';
import TasksScenarioHelper from '../tasls/tasks.scenario.helper';

export default class ListsScenario {
  private app: NestExpressApplication;

  public constructor(app: NestExpressApplication) {
    this.app = app;
  }

  public async createLists(): Promise<number[]> {
    const groceries = {
      input: {
        name: 'Groceries',
        description: 'This is my groceries list'
      }
    };

    const ids: number[] = [];

    await AppTestHelper.gqlRequest(this.app)
      .send({ query: ListsScenarioHelper.getCreateListMutation(), variables: groceries })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.createList).toBeDefined();
        expect(body.data.createList).toHaveProperty('id');
        expect(body.data.createList.name).toBe(groceries.input.name);
        expect(body.data.createList.description).toBe(groceries.input.description);

        ids.push(body.data.createList.id);
      });

    const shopping = {
      input: {
        name: 'Shopping',
        description: 'This is my shopping list'
      }
    };

    await AppTestHelper.gqlRequest(this.app)
      .send({ query: ListsScenarioHelper.getCreateListMutation(), variables: shopping })
      .expect(200)
      .expect(({ body }) => {
        ids.push(body.data.createList.id);
      });

    return ids;
  }

  public async updateList() {
    const id = await this.createLists();
    const variables = {
      input: {
        id,
        name: 'My day',
        description: 'This is a description (updated)'
      }
    };

    await AppTestHelper.gqlRequest(this.app)
      .send({ query: ListsScenarioHelper.getUpdateListMutation(), variables })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.updateList).toBeDefined();
        expect(body.data.updateList.id).toBe(variables.input.id);
        expect(body.data.updateList.name).toBe(variables.input.name);
        expect(body.data.updateList.description).toBe(variables.input.description);
      });
  }

  public async getLists() {
    await this.createLists();

    const variables = {
      input: {}
    };

    await AppTestHelper.gqlRequest(this.app)
      .send({ query: ListsScenarioHelper.getListsQuery(), variables })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.lists).toBeDefined();
        expect(body.data.lists.totalCount).toBe(2);
        expect(body.data.lists.data.length).toBe(2);
      });
  }

  public async getListById() {
    const listIds = await this.createLists();
    const id = listIds[0];
    const tasksScenario = new TasksScenario(this.app);
    await tasksScenario.createTasks(listIds);

    await AppTestHelper.gqlRequest(this.app)
      .send({ query: ListsScenarioHelper.getListByIdQuery(), variables: { id } })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.list).toBeDefined();
        expect(body.data.list.id).toBe(id);
        expect(body.data.list.name).toBe('Groceries');
        expect(body.data.list.tasks.length).toBe(1);
        expect(body.data.list.tasks[0].name).toBe('Sample task 2');
      });
  }

  public async deleteList() {
    const listIds = await this.createLists();
    const listId = listIds[0];
    const tasksScenario = new TasksScenario(this.app);
    const taskId = await tasksScenario.createTasks(listIds);

    await AppTestHelper.gqlRequest(this.app)
      .send({ query: ListsScenarioHelper.getDeleteListMutation(), variables: { id: listId } })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.deleteList).toBeDefined();
        expect(body.data.deleteList.name).toBe('Groceries');
      });

    await AppTestHelper.gqlRequest(this.app)
      .send({ query: TasksScenarioHelper.getTaskByIdQuery(), variables: { id: taskId } })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors[0].message).toBe('Task not found');
      });
  }
}
