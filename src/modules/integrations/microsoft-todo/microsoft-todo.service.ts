import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '../../../providers/http/http.service';
import { MSIdentityService } from './ms-identity/ms-identity.service';
import { ListOutput, ListsResponse, TaskOutput, TasksResponse } from './dto/microsoft-todo.output';
import { CallMicrosoftGraphAPIInput, UpdateTaskInput } from './microsoft-todo.types';
import { HttpMethod } from '../../../shared/enums';

@Injectable()
export class MicrosoftTodoService {
  private baseUrl: string;

  public constructor(
    private httpService: HttpService,
    private msIdentityService: MSIdentityService
  ) {
    this.baseUrl = 'https://graph.microsoft.com/beta/me/todo/lists';
  }

  private async callAPI<T>(input: CallMicrosoftGraphAPIInput): Promise<T> {
    const { userId, url, method, body } = input;

    try {
      const res = await this.httpService.request({
        url,
        method,
        headers: await this.getHeaders(userId),
        data: body
      });

      return res.data as T;
    } catch (err) {
      if (err?.response?.data?.error?.code === 'InvalidAuthenticationToken') {
        await this.msIdentityService.refreshTokens(userId);
        return this.callAPI<T>(input);
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

  public getLists(userId: number): Promise<ListsResponse> {
    const input = { userId, url: this.baseUrl, method: HttpMethod.GET };
    return this.callAPI<ListsResponse>(input);
  }

  public createList(userId: number, listName: string): Promise<ListOutput> {
    const input = {
      userId,
      url: this.baseUrl,
      method: HttpMethod.POST,
      body: { displayName: listName }
    };
    return this.callAPI<ListOutput>(input);
  }

  public updateList(userId: number, listId: string, listName: string): Promise<ListOutput> {
    const input = {
      userId,
      url: `${this.baseUrl}/${listId}`,
      method: HttpMethod.PATCH,
      body: { displayName: listName }
    };
    return this.callAPI<ListOutput>(input);
  }

  public deleteList(userId: number, listId: string): Promise<ListOutput> {
    const input = {
      userId,
      url: `${this.baseUrl}/${listId}`,
      method: HttpMethod.DELETE
    };
    return this.callAPI<ListOutput>(input);
  }

  public getTasksFromList(userId: number, listId: string): Promise<TasksResponse> {
    const input = {
      userId,
      url: `${this.baseUrl}/${listId}/tasks`,
      method: HttpMethod.GET
    };

    return this.callAPI<TasksResponse>(input);
  }

  public getTask(userId: number, listId: string, taskId: string): Promise<TaskOutput> {
    const input = {
      userId,
      url: `${this.baseUrl}/${listId}/tasks/${taskId}`,
      method: HttpMethod.GET
    };

    return this.callAPI<TaskOutput>(input);
  }

  public createTask(userId: number, listId: string, taskName: string): Promise<TaskOutput> {
    const input = {
      userId,
      url: `${this.baseUrl}/${listId}/tasks`,
      method: HttpMethod.POST,
      body: { title: taskName }
    };

    return this.callAPI<TaskOutput>(input);
  }

  public updateTask(input: UpdateTaskInput): Promise<TaskOutput> {
    const { userId, listId, taskId, taskName } = input;

    const data = {
      userId,
      url: `${this.baseUrl}/${listId}/tasks/${taskId}`,
      method: HttpMethod.PATCH,
      body: { title: taskName }
    };

    return this.callAPI<TaskOutput>(data);
  }

  public deleteTask(userId: number, listId: string, taskId: string): Promise<TaskOutput> {
    const input = {
      userId,
      url: `${this.baseUrl}/${listId}/tasks/${taskId}`,
      method: HttpMethod.DELETE
    };

    return this.callAPI<TaskOutput>(input);
  }
}
