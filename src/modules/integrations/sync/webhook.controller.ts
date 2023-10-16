import { Body, Controller, Header, Post, Query } from '@nestjs/common';

@Controller('webhook')
export class WebhookController {
  @Post()
  @Header('content-type', 'text/plain')
  public notify(@Body() body: unknown, @Query() query: { validationToken: string }) {
    console.log(query);
    console.log(body);
    return query?.validationToken;
  }
}
