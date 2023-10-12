import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import TasksScenario from './scenarios/tasls/tasks.scenario';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppTestHelper } from './app.integration-tests.helper';
import ListsScenario from './scenarios/lists/lists.scenario';

describe('# App (integration tests)', () => {
  // Get rid of excessive logging
  process.env.LOG_LEVEL = 'fatal';

  let app: NestExpressApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await AppTestHelper.truncateAllTables(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('# Tasks', () => {
    let tasksScenario: TasksScenario;

    beforeAll(() => {
      tasksScenario = new TasksScenario(app);
    });

    beforeEach(async () => {
      await AppTestHelper.truncateTable(app, 'tasks');
    });

    it('should create tasks', () => tasksScenario.createTasks());

    it('should update a task (name, description, and set it to done)', () =>
      tasksScenario.updateTask());

    it('should get all tasks which are not done', () => tasksScenario.getNotDoneTasks());

    it('should get all tasks which are done', () => tasksScenario.getDoneTasks());

    it('should get a task by id', () => tasksScenario.getTaskById());

    it('should delete a task', () => tasksScenario.deleteTask());
  });

  describe('# Lists', () => {
    let listsScenario: ListsScenario;

    beforeAll(() => {
      listsScenario = new ListsScenario(app);
    });

    beforeEach(async () => {
      await AppTestHelper.truncateTable(app, 'lists');
    });

    it('should create lists', () => listsScenario.createLists());

    it('should update a list (name, description)', () => listsScenario.updateList());

    it('should get all lists', () => listsScenario.getLists());

    it('should retrieve a list by id and its tasks', () => listsScenario.getListById());

    it('should delete a list and tasks associated with it', () => listsScenario.deleteList());
  });
});
