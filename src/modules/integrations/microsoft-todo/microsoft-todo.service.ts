import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '../../../providers/http/http.service';
import { MSIdentityService } from './ms-identity/ms-identity.service';
import {
  ListOutput,
  ListsResponse,
  SubscriptionResponse,
  TaskOutput,
  TasksResponse
} from './dto/microsoft-todo.output';
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
    const { listId, taskId, title, status } = input;
    if (!title && !status) {
      throw new Error('Missing required fields');
    }

    return this.callAPI<TaskOutput>(
      `${this.baseUrl}/${listId}/tasks/${taskId}`,
      HttpMethod.PATCH,
      Object.assign({}, title ? { title } : {}, status ? { status } : {})
    );
  }

  public deleteTask(listId: string, taskId: string): Promise<TaskOutput> {
    return this.callAPI<TaskOutput>(`${this.baseUrl}/${listId}/tasks/${taskId}`, HttpMethod.DELETE);
  }

  /**
   * Subscribe to Microsoft Graph API webhook notifications.
   * Expiration DateTime (Maximum length of subscription):
   * @see https://tinyurl.com/y6drzxrn
   */
  public async subscribe(listIds: string[], webhookUrl: string) {
    if (!listIds.length) {
      throw new Error('No lists found. Please create a list first.');
    }

    const body = {
      changeType: 'created,updated,deleted',
      notificationUrl: webhookUrl,
      resource: '',
      expirationDateTime: dayjs().add(4230, 'minute').toISOString()
    };

    const subscriptions: SubscriptionResponse[] = [];

    for (const listId of listIds) {
      body.resource = `/me/todo/lists/${listId}/tasks`;
      const res = await this.callAPI<SubscriptionResponse>(
        this.baseUrlSubscriptions,
        HttpMethod.POST,
        body
      );
      subscriptions.push(res);
    }

    // TODO: Handle subscription renewal

    return subscriptions;
  }

  public async unsubscribe(subscriptionIds: string[]) {
    for (const id of subscriptionIds) {
      await this.callAPI<SubscriptionResponse>(
        `${this.baseUrlSubscriptions}/${id}`,
        HttpMethod.DELETE
      );
    }
  }

  public getSubscription(subscriptionId: string) {
    return this.callAPI<SubscriptionResponse>(
      `${this.baseUrlSubscriptions}/${subscriptionId}`,
      HttpMethod.GET
    );
  }
}
