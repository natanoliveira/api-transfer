import { Global, Module } from '@nestjs/common';
import { RabbitMqClient } from './rabbitmq.client';

@Global()
@Module({
  providers: [RabbitMqClient],
  exports: [RabbitMqClient],
})
export class MessagingModule {}
