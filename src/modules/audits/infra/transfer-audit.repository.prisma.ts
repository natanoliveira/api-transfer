import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { TransferAuditRepository } from '../repositories/transfer-audit.repository.interface';

@Injectable()
export class PrismaTransferAuditRepository implements TransferAuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entry: { transferId: number; eventType: string; payload: Record<string, unknown> }): Promise<void> {
    await this.prisma.transferAudit.create({
      data: {
        transferId: entry.transferId,
        eventType: entry.eventType,
        payload: entry.payload,
      },
    });
  }
}
