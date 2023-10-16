import { Body, Controller, Header, Post, Query } from '@nestjs/common';
import { WebhookNotification } from '../dto/microsoft-todo.output';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  public constructor(private webhookService: WebhookService) {}

  @Post()
  @Header('content-type', 'text/plain')
  public async notify(
    @Body() body: WebhookNotification,
    @Query() query: { validationToken: string }
  ) {
    for (const notificationItem of body.value) {
      await this.webhookService.handleRequest(notificationItem);
    }

    return query?.validationToken;
  }
}
