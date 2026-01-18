import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { Transfer } from '../../../domain/entities/transfer.entity';
import { TransferRepository } from '../repositories/transfer.repository.interface';

@Injectable()
export class InMemoryTransferRepository implements TransferRepository {
  private readonly transfers: Transfer[] = [];

  async create(transfer: Transfer): Promise<Transfer> {
    const created = new Transfer(
      randomUUID(),
      transfer.payerId,
      transfer.payeeId,
      transfer.value,
      transfer.status,
      transfer.createdAt,
    );
    this.transfers.push(created);
    return created;
  }

  async findManyPaged(params: { page: number; limit: number }): Promise<{ items: Transfer[]; total: number }> {
    const items = [...this.transfers].sort((a, b) => a.id.localeCompare(b.id));
    const total = items.length;
    const start = (params.page - 1) * params.limit;
    return { items: items.slice(start, start + params.limit), total };
  }
}
