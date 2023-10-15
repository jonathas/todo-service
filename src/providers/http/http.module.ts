import { Global, Module } from '@nestjs/common';
import { HttpService } from './http.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [HttpService],
  exports: [HttpService]
})
export class HttpModule {}
