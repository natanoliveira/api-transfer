import { Inject, Injectable } from '@nestjs/common';
import { Prisma, Transfer as PrismaTransfer } from '@prisma/client';
import { Transfer } from '../../../domain/entities/transfer.entity';
import { TransferStatus } from '../../../domain/enums/transfer-status.enum';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { TransferRepository } from '../repositories/transfer.repository.interface';

@Injectable()
export class PrismaTransferRepository implements TransferRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService | Prisma.TransactionClient) {}

  async create(transfer: Transfer): Promise<Transfer> {
    const created = await this.prisma.transfer.create({
      data: {
        payerId: transfer.payerId,
        payeeId: transfer.payeeId,
        value: transfer.value,
        status: transfer.status,
        sentEmail: transfer.sentEmail,
        sentSms: transfer.sentSms,
      },
    });
    return this.toDomain(created);
  }

  async findManyPaged(params: { page: number; limit: number }): Promise<{ items: Transfer[]; total: number }> {
    const skip = (params.page - 1) * params.limit;
    const take = params.limit;
    const items = await this.prisma.transfer.findMany({ skip, take, orderBy: { id: 'asc' } });
    const total = await this.prisma.transfer.count();
    return { items: items.map((transfer) => this.toDomain(transfer)), total };
  }

  async updateNotificationStatus(id: string, status: { sentEmail: boolean; sentSms: boolean }): Promise<void> {
    await this.prisma.transfer.update({
      where: { id },
      data: {
        sentEmail: status.sentEmail,
        sentSms: status.sentSms,
      },
    });
  }

  private toDomain(transfer: PrismaTransfer): Transfer {
    return new Transfer(
      transfer.id,
      transfer.payerId,
      transfer.payeeId,
      Number(transfer.value),
      transfer.status as TransferStatus,
      transfer.sentEmail,
      transfer.sentSms,
      transfer.createdAt,
    );
  }
}
