import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '../../../providers/http/http.service';
import { MSIdentityService } from './ms-identity/ms-identity.service';
import { ListOutput, ListsResponse, TaskOutput, TasksResponse } from './dto/microsoft-todo.output';
import { UpdateTaskInput } from './microsoft-todo.types';

@Injectable()
export class MicrosoftTodoService {
  private baseUrl: string;

  public constructor(
    private httpService: HttpService,
    private msIdentityService: MSIdentityService
  ) {
    this.baseUrl = 'https://graph.microsoft.com/beta/me/todo/lists';
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

  public async getLists(userId: number): Promise<ListsResponse> {
    const res = await this.httpService.get(this.baseUrl, {
      headers: await this.getHeaders(userId)
    });

    return res.data as ListsResponse;
  }

  public async createList(userId: number, listName: string): Promise<ListOutput> {
    const res = await this.httpService.post(
      this.baseUrl,
      { displayName: listName },
      { headers: await this.getHeaders(userId) }
    );

    return res.data as ListOutput;
  }

  public async updateList(userId: number, listId: string, listName: string): Promise<ListOutput> {
    const res = await this.httpService.patch(
      `${this.baseUrl}/${listId}`,
      { displayName: listName },
      { headers: await this.getHeaders(userId) }
    );

    return res.data as ListOutput;
  }

  public async deleteList(userId: number, listId: string): Promise<ListOutput> {
    const res = await this.httpService.delete(`${this.baseUrl}/${listId}`, {
      headers: await this.getHeaders(userId)
    });

    return res.data as ListOutput;
  }

  public async getTasksFromList(userId: number, listId: string): Promise<TasksResponse> {
    const res = await this.httpService.get(`${this.baseUrl}/${listId}/tasks`, {
      headers: await this.getHeaders(userId)
    });

    return res.data as TasksResponse;
  }

  public async getTask(userId: number, listId: string, taskId: string): Promise<TaskOutput> {
    const res = await this.httpService.get(`${this.baseUrl}/${listId}/tasks/${taskId}`, {
      headers: await this.getHeaders(userId)
    });

    return res.data as TaskOutput;
  }

  public async createTask(userId: number, listId: string, taskName: string): Promise<TaskOutput> {
    const res = await this.httpService.post(
      `${this.baseUrl}/${listId}/tasks`,
      { title: taskName },
      { headers: await this.getHeaders(userId) }
    );

    return res.data as TaskOutput;
  }

  public async updateTask(input: UpdateTaskInput): Promise<TaskOutput> {
    const { userId, listId, taskId, taskName } = input;

    const res = await this.httpService.patch(
      `${this.baseUrl}/${listId}/tasks/${taskId}`,
      { title: taskName },
      { headers: await this.getHeaders(userId) }
    );

    return res.data as TaskOutput;
  }

  public async deleteTask(userId: number, listId: string, taskId: string): Promise<TaskOutput> {
    const res = await this.httpService.delete(`${this.baseUrl}/${listId}/tasks/${taskId}`, {
      headers: await this.getHeaders(userId)
    });

    return res.data as TaskOutput;
  }
}
