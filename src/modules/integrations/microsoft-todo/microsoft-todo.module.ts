import { Module } from '@nestjs/common';
import { MSIdentityController } from './ms-identity.controller';
import { ConfigModule } from '@nestjs/config';
import { MicrosoftIntegrations } from './microsoft-integrations.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MSIdentityService } from './ms-identity.service';

@Module({
  imports: [TypeOrmModule.forFeature([MicrosoftIntegrations]), ConfigModule],
  controllers: [MSIdentityController],
  providers: [MSIdentityService]
})
export class MicrosoftToDoModule {}
