import { Injectable } from '@nestjs/common';
import { Transfer } from '../../../domain/entities/transfer.entity';
import { RabbitMqClient } from '../../../infra/messaging/rabbitmq.client';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class RabbitMqNotificationService implements NotificationService {
  constructor(private readonly rabbitMq: RabbitMqClient) {}

  async notifyTransfer(transfer: Transfer): Promise<void> {
    await this.rabbitMq.publish('transfer.events', 'transfer.completed', {
      type: 'TRANSFER_COMPLETED',
      transferId: transfer.id,
      payerId: transfer.payerId,
      payeeId: transfer.payeeId,
      value: transfer.value,
      status: transfer.status,
      createdAt: transfer.createdAt.toISOString(),
    });
  }
}
