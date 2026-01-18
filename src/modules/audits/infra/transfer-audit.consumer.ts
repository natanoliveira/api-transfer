import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMqClient } from '../../../infra/messaging/rabbitmq.client';
import { TransferAuditService } from '../services/transfer-audit.service';

@Injectable()
export class TransferAuditConsumer implements OnModuleInit {
  private readonly logger = new Logger(TransferAuditConsumer.name);

  constructor(
    private readonly rabbitMq: RabbitMqClient,
    private readonly auditService: TransferAuditService,
  ) {}

  async onModuleInit() {
    if (process.env.RABBITMQ_ENABLED !== 'true') {
      return;
    }
    await this.rabbitMq.consume('transfer.audit', 'transfer.events', 'transfer.*', async (payload) => {
      await this.auditService.recordTransferEvent(payload);
      this.logger.log(`Auditoria registrada para transferencia ${payload.transferId ?? 'desconhecida'}.`);
    });
  }
}
