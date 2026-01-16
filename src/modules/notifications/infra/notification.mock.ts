import { Injectable } from '@nestjs/common';
import { Transfer } from '../../../domain/entities/transfer.entity';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class MockNotificationService implements NotificationService {
  async notifyTransfer(_transfer: Transfer): Promise<void> {
    return;
  }
}
