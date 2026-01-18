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
      },
    });
    return this.toDomain(created);
  }

  private toDomain(transfer: PrismaTransfer): Transfer {
    return new Transfer(
      transfer.id,
      transfer.payerId,
      transfer.payeeId,
      Number(transfer.value),
      transfer.status as TransferStatus,
      transfer.createdAt,
    );
  }
}
