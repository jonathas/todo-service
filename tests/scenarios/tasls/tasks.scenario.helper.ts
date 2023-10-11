export default class TasksScenarioHelper {
  public static getCreateTaskMutation() {
    return `
    mutation createTask($input: CreateTaskInput!) {
      createTask(input: $input) {
        ${TasksScenarioHelper.getTaskObject()}
      }
    }
    `;
  }

  public static getTaskObject() {
    return `
      id
      name
      description
      isDone
      createdAt
      updatedAt
    `;
  }

  public static getUpdateTaskMutation() {
    return `
    mutation updateTask($input: UpdateTaskInput!) {
      updateTask(input: $input) {
        ${TasksScenarioHelper.getTaskObject()}
      }
    }
    `;
  }

  public static getTasksQuery() {
    return `
    query tasks($input: TaskInput!) {
      tasks(input: $input) {
        totalCount
        data {
          ${TasksScenarioHelper.getTaskObject()}
        }
      }
    }
      `;
  }
}
