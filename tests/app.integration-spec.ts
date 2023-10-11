import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import TasksScenario from './scenarios/tasls/tasks.scenario';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppTestHelper } from './app.integration-tests.helper';

describe('# App (integration tests)', () => {
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

    it('should list all tasks which are not done', () => tasksScenario.listNotDoneTasks());

    it('should list all tasks which are done', () => tasksScenario.listDoneTasks());

    //it.skip('should list all tasks with their lists', () => {});

    it('should get a task by id', () => tasksScenario.getTaskById());

    //it.skip('should retrieve a task by id with the lists it belongs to', () => {});

    it('should delete a task', () => tasksScenario.deleteTask());
  });

  /*describe.skip('# Lists', () => {
    let tasksScenario: TasksScenario;

    beforeAll(() => {
      tasksScenario = new TasksScenario(app);
    });

    it('should create lists', () => {});

    it('should update a list (name, description)', () => {});

    it('should list all lists', () => {});

    it('should retrieve a list by id and its tasks', () => {});

    it('should delete a list', () => {});
  });*/
});
