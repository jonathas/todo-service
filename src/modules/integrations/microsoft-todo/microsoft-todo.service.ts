import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '../../../providers/http/http.service';
import { MSIdentityService } from './ms-identity/ms-identity.service';
import { ListOutput, ListsResponse, TaskOutput, TasksResponse } from './dto/microsoft-todo.output';
import { HttpMethod } from '../../../shared/enums';
import { UsersService } from '../../users/users.service';

@Injectable()
export class MicrosoftTodoService {
  private baseUrl: string;

  public constructor(
    private httpService: HttpService,
    private msIdentityService: MSIdentityService,
    private usersService: UsersService
  ) {
    this.baseUrl = 'https://graph.microsoft.com/beta/me/todo/lists';
  }

  private async callAPI<T>(url: string, method: HttpMethod, body?: unknown): Promise<T> {
    // TODO: The user should come from the RequestUser object,
    // populated in the authentication guard.
    // The method below (findLastUser) is for demo purposes only.
    const user = await this.usersService.findLastUser();

    try {
      const res = await this.httpService.request({
        url,
        method,
        headers: await this.getHeaders(user.id),
        data: body
      });

      return res.data as T;
    } catch (err) {
      if (err?.response?.data?.error?.code === 'InvalidAuthenticationToken') {
        await this.msIdentityService.refreshTokens(user.id);
        return this.callAPI<T>(url, method, body);
      }
      throw err;
    }
  }

  private async getHeaders(userId: number) {
    const tokens = await this.msIdentityService.getTokensFromDB(userId);
    if (!tokens) {
      throw new UnauthorizedException('No tokens found! Please authenticate first.');
    }
    return {
      Authorization: `Bearer ${tokens.accessToken}`
    };
  }

  public getLists(): Promise<ListsResponse> {
    return this.callAPI<ListsResponse>(this.baseUrl, HttpMethod.GET);
  }

  public getList(listId: string): Promise<ListOutput> {
    return this.callAPI<ListOutput>(`${this.baseUrl}/${listId}`, HttpMethod.GET);
  }

  public createList(listName: string): Promise<ListOutput> {
    return this.callAPI<ListOutput>(this.baseUrl, HttpMethod.POST, { displayName: listName });
  }

  public updateList(listId: string, listName: string): Promise<ListOutput> {
    return this.callAPI<ListOutput>(`${this.baseUrl}/${listId}`, HttpMethod.PATCH, {
      displayName: listName
    });
  }

  public deleteList(listId: string): Promise<ListOutput> {
    return this.callAPI<ListOutput>(`${this.baseUrl}/${listId}`, HttpMethod.DELETE);
  }

  public getTasksFromList(listId: string): Promise<TasksResponse> {
    return this.callAPI<TasksResponse>(`${this.baseUrl}/${listId}/tasks`, HttpMethod.GET);
  }

  public getTask(listId: string, taskId: string): Promise<TaskOutput> {
    return this.callAPI<TaskOutput>(`${this.baseUrl}/${listId}/tasks/${taskId}`, HttpMethod.GET);
  }

  public createTask(listId: string, taskName: string): Promise<TaskOutput> {
    return this.callAPI<TaskOutput>(`${this.baseUrl}/${listId}/tasks`, HttpMethod.POST, {
      title: taskName
    });
  }

  public updateTask(listId: string, taskId: string, taskName: string): Promise<TaskOutput> {
    return this.callAPI<TaskOutput>(`${this.baseUrl}/${listId}/tasks/${taskId}`, HttpMethod.PATCH, {
      title: taskName
    });
  }

  public deleteTask(listId: string, taskId: string): Promise<TaskOutput> {
    return this.callAPI<TaskOutput>(`${this.baseUrl}/${listId}/tasks/${taskId}`, HttpMethod.DELETE);
  }
}
