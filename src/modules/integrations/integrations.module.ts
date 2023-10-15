import { Module } from '@nestjs/common';
import { MicrosoftTodoModule } from './microsoft-todo/microsoft-todo.module';

@Module({
  imports: [MicrosoftTodoModule]
})
export class IntegrationsModule {}
