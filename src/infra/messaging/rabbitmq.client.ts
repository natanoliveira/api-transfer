import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Channel, Connection, ConsumeMessage, connect } from 'amqplib';

type MessageHandler = (payload: Record<string, unknown>) => Promise<void>;

@Injectable()
export class RabbitMqClient implements OnModuleInit, OnModuleDestroy {
  private connection?: Connection;
  private channel?: Channel;
  private readonly logger = new Logger(RabbitMqClient.name);

  private isEnabled(): boolean {
    return process.env.RABBITMQ_ENABLED === 'true';
  }

  private getUrl(): string {
    return process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';
  }

  async onModuleInit() {
    if (!this.isEnabled()) {
      return;
    }
    await this.ensureChannel();
  }

  async onModuleDestroy() {
    await this.channel?.close().catch(() => undefined);
    await this.connection?.close().catch(() => undefined);
  }

  async publish(exchange: string, routingKey: string, payload: Record<string, unknown>): Promise<void> {
    if (!this.isEnabled()) {
      return;
    }
    const channel = await this.ensureChannel();
    await channel.assertExchange(exchange, 'topic', { durable: true });
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)), { persistent: true });
  }

  async consume(queue: string, exchange: string, routingKey: string, handler: MessageHandler): Promise<void> {
    if (!this.isEnabled()) {
      return;
    }
    const channel = await this.ensureChannel();
    await channel.assertExchange(exchange, 'topic', { durable: true });
    const assertedQueue = await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(assertedQueue.queue, exchange, routingKey);
    await channel.consume(assertedQueue.queue, async (msg) => {
      if (!msg) {
        return;
      }
      await this.handleMessage(msg, handler, channel);
    });
  }

  private async ensureChannel(): Promise<Channel> {
    if (this.channel) {
      return this.channel;
    }
    const url = this.getUrl();
    this.connection = await connect(url);
    this.channel = await this.connection.createChannel();
    return this.channel;
  }

  private async handleMessage(msg: ConsumeMessage, handler: MessageHandler, channel: Channel) {
    try {
      const payload = JSON.parse(msg.content.toString()) as Record<string, unknown>;
      await handler(payload);
      channel.ack(msg);
    } catch (error) {
      const err = error as Error;
      this.logger.error('Erro ao processar mensagem RabbitMQ.', err.stack);
      channel.nack(msg, false, false);
    }
  }
}
