import { Module } from '@nestjs/common';
import { MSIdentityController } from './ms-identity.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [MSIdentityController]
})
export class MicrosoftToDoModule {}
