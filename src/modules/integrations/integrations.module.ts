import { Module } from '@nestjs/common';
import { MicrosoftToDoModule } from './microsoft-todo/microsoft-todo.module';

@Module({
  imports: [MicrosoftToDoModule]
})
export class IntegrationsModule {}
