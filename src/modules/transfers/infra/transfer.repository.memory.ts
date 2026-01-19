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
      transfer.sentEmail,
      transfer.sentSms,
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

  async findManyByUserPaged(params: {
    userId: string;
    page: number;
    limit: number;
  }): Promise<{ items: Transfer[]; total: number }> {
    const items = this.transfers
      .filter((transfer) => transfer.payerId === params.userId || transfer.payeeId === params.userId)
      .sort((a, b) => a.id.localeCompare(b.id));
    const total = items.length;
    const start = (params.page - 1) * params.limit;
    return { items: items.slice(start, start + params.limit), total };
  }

  async findManyByPayerPaged(params: {
    userId: string;
    page: number;
    limit: number;
  }): Promise<{ items: Transfer[]; total: number }> {
    const items = this.transfers
      .filter((transfer) => transfer.payerId === params.userId)
      .sort((a, b) => a.id.localeCompare(b.id));
    const total = items.length;
    const start = (params.page - 1) * params.limit;
    return { items: items.slice(start, start + params.limit), total };
  }

  async findManyByPayeePaged(params: {
    userId: string;
    page: number;
    limit: number;
  }): Promise<{ items: Transfer[]; total: number }> {
    const items = this.transfers
      .filter((transfer) => transfer.payeeId === params.userId)
      .sort((a, b) => a.id.localeCompare(b.id));
    const total = items.length;
    const start = (params.page - 1) * params.limit;
    return { items: items.slice(start, start + params.limit), total };
  }

  async updateNotificationStatus(id: string, status: { sentEmail: boolean; sentSms: boolean }): Promise<void> {
    const index = this.transfers.findIndex((transfer) => transfer.id === id);
    if (index === -1) {
      return;
    }
    const current = this.transfers[index];
    this.transfers[index] = new Transfer(
      current.id,
      current.payerId,
      current.payeeId,
      current.value,
      current.status,
      status.sentEmail,
      status.sentSms,
      current.createdAt,
    );
  }
}
