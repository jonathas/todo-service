import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '../../../providers/http/http.service';
import { MSIdentityService } from './ms-identity/ms-identity.service';
import { ListOutput, ListsResponse, TaskOutput, TasksResponse } from './dto/microsoft-todo.output';
import { HttpMethod } from '../../../shared/enums';
import { UsersService } from '../../users/users.service';
import { UpdateMicrosoftTaskInput } from './microsoft-todo.types';
import * as dayjs from 'dayjs';

@Injectable()
export class MicrosoftTodoService {
  private baseUrl: string;

  private baseUrlSubscriptions: string;

  public constructor(
    private httpService: HttpService,
    private msIdentityService: MSIdentityService,
    private usersService: UsersService
  ) {
    this.baseUrl = 'https://graph.microsoft.com/beta/me/todo/lists';
    this.baseUrlSubscriptions = 'https://graph.microsoft.com/v1.0/subscriptions';
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

  public updateTask(input: UpdateMicrosoftTaskInput): Promise<TaskOutput> {
    const { listId, taskId, taskName } = input;
    const data = {
      title: taskName
    };
    return this.callAPI<TaskOutput>(
      `${this.baseUrl}/${listId}/tasks/${taskId}`,
      HttpMethod.PATCH,
      data
    );
  }

  public deleteTask(listId: string, taskId: string): Promise<TaskOutput> {
    return this.callAPI<TaskOutput>(`${this.baseUrl}/${listId}/tasks/${taskId}`, HttpMethod.DELETE);
  }

  /**
   * Expiration DateTime (Maximum length of subscription):
   * @see https://tinyurl.com/y6drzxrn
   */
  public async subscribe(webhookUrl: string) {
    const lists = await this.getLists();

    if (!lists.value.length) {
      return {
        message: 'No lists found. Please create a list first.'
      };
    }

    const listIds = lists.value.map((list) => list.id);

    const body = {
      changeType: 'created,updated,deleted',
      notificationUrl: webhookUrl,
      resource: '',
      expirationDateTime: dayjs().add(4230, 'minute').toISOString()
    };

    for (const listId of listIds) {
      body.resource = `/me/todo/lists/${listId}/tasks`;
      await this.callAPI(this.baseUrlSubscriptions, HttpMethod.POST, body);
    }

    return {
      message: 'Subscribed successfully!'
    };
  }
}
