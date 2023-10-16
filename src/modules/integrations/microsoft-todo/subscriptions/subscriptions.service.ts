import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriptions } from './subscriptions.entity';
import { Repository } from 'typeorm';
import { SubscriptionResponse } from '../dto/microsoft-todo.output';

@Injectable()
export class SubscriptionsService {
  public constructor(
    @InjectRepository(Subscriptions)
    private readonly subscriptionsRepository: Repository<Subscriptions>
  ) {}

  public create(subscription: SubscriptionResponse) {
    const data: Partial<Subscriptions> = {
      subscriptionId: subscription.id,
      resource: subscription.resource,
      extListId: this.getListIdFromResource(subscription.resource),
      expirationDateTime: new Date(subscription.expirationDateTime)
    };
    return this.subscriptionsRepository.save(this.subscriptionsRepository.create(data));
  }

  private getListIdFromResource(resource: string) {
    return resource.split('/')[4];
  }

  public delete(subscriptions: Subscriptions[]) {
    return this.subscriptionsRepository.remove(subscriptions);
  }

  public findOneBySubscriptionId(subscriptionId: string): Promise<Subscriptions> {
    return this.subscriptionsRepository.findOne({ where: { subscriptionId } });
  }

  public findAll(): Promise<Subscriptions[]> {
    return this.subscriptionsRepository.find();
  }
}
