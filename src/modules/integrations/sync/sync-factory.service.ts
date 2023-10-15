import { Injectable, Type } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncServices } from './sync.enum';
import { MicrosoftTodoService } from '../microsoft-todo/microsoft-todo.service';

@Injectable()
export class SyncFactoryService {
  public createService(serviceType: SyncServices): Type<SyncService> {
    // Below is ready for extension even though the services are not yet implemented
    const services = {
      [SyncServices.MICROSOFT]: MicrosoftTodoService,
      [SyncServices.GOOGLE]: MicrosoftTodoService,
      [SyncServices.TODOIST]: MicrosoftTodoService
    };
    return services[serviceType];
  }
}
