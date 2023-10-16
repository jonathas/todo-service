import { Body, Controller, Header, Post, Query } from '@nestjs/common';
import { WebhookNotification } from '../dto/microsoft-todo.output';
import { WebhookService } from './webhook.service';
import { LoggerService } from '../../../../providers/logger/logger.service';

@Controller('webhook')
export class WebhookController {
  public constructor(private webhookService: WebhookService, private logger: LoggerService) {
    this.logger.setContext(WebhookController.name);
  }

  @Post()
  @Header('content-type', 'text/plain')
  public async notify(
    @Body() body: WebhookNotification,
    @Query() query: { validationToken: string }
  ) {
    try {
      this.logger.info('Received a notification from Microsoft Todo');
      this.logger.debug(JSON.stringify(body));

      if (body?.value?.length) {
        for (const notificationItem of body.value) {
          await this.webhookService.handleRequest(notificationItem);
        }
      }

      return query?.validationToken;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }
}
