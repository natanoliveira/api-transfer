import { Module } from '@nestjs/common';
import { MockNotificationService } from './infra/notification.mock';

@Module({
  providers: [MockNotificationService, { provide: 'NotificationService', useExisting: MockNotificationService }],
  exports: [{ provide: 'NotificationService', useExisting: MockNotificationService }],
})
export class NotificationsModule {}
