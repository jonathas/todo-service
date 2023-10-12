export default class ListsScenarioHelper {
  public static getCreateListMutation() {
    return `
    mutation createList($input: CreateListInput!) {
      createList(input: $input) {
        ${ListsScenarioHelper.getListObject()}
      }
    }    
    `;
  }

  private static getListObject() {
    return `
      id
      name
      description
      createdAt
      updatedAt
    `;
  }

  public static getUpdateListMutation() {
    return `
    mutation updateList($input: UpdateListInput!) {
      updateList(input: $input) {
        ${ListsScenarioHelper.getListObject()}
      }
    }
    `;
  }

  public static getListsQuery() {
    return `
    query lists($input: ListInput!) {
      lists(input: $input) {
        totalCount
        data {
          ${ListsScenarioHelper.getListObject()}
        }
      }
    }
    `;
  }

  public static getListByIdQuery() {
    return `
      query list($id: Int!) {
        list(id: $id) {
          ${ListsScenarioHelper.getListObject()}
          tasks {
            id
            name
            description
            isDone
            createdAt
            updatedAt
          }
        }
      }`;
  }

  public static getDeleteListMutation() {
    return `
      mutation deleteList($id: Int!) {
        deleteList(id: $id) {
          ${ListsScenarioHelper.getListObject()}
        }
      }
    `;
  }
}
