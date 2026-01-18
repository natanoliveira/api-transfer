import { Inject, Injectable } from '@nestjs/common';
import { TransferAuditRepository } from '../repositories/transfer-audit.repository.interface';

@Injectable()
export class TransferAuditService {
  constructor(
    @Inject('TransferAuditRepository') private readonly repository: TransferAuditRepository,
  ) {}

  async recordTransferEvent(payload: Record<string, unknown>) {
    const transferId = Number(payload.transferId);
    if (!transferId) {
      return;
    }
    await this.repository.create({
      transferId,
      eventType: String(payload.type ?? 'TRANSFER_EVENT'),
      payload,
    });
  }
}
