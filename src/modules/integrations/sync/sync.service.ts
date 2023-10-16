import { Injectable } from '@nestjs/common';

@Injectable()
export class SyncService {
  public sync() {
    throw new Error('Method not implemented.');

    // TODO: Go through all the lists in the DB. If there are no subscriptions for them, create them
    // TODO: If the lists don't have extId, create them in the API

    // TODO: Go through all the tasks in the DB. If they don't have extId, create them in the API

    // TODO: Go though all the lists in the API. If they don't exist in the DB, create them

    // TODO: Go though all the tasks in the API. If they don't exist in the DB, create them
  }
}
