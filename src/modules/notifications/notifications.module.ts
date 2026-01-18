import { Module } from '@nestjs/common';
import { MockNotificationService } from './infra/notification.mock';
import { RabbitMqNotificationService } from './infra/rabbitmq-notification.service';

@Module({
  providers: [
    MockNotificationService,
    RabbitMqNotificationService,
    {
      provide: 'NotificationService',
      useFactory: (mockService: MockNotificationService, rabbitService: RabbitMqNotificationService) => {
        return process.env.RABBITMQ_ENABLED === 'true' ? rabbitService : mockService;
      },
      inject: [MockNotificationService, RabbitMqNotificationService],
    },
  ],
  exports: ['NotificationService'],
})
export class NotificationsModule {}
