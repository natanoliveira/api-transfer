import { Injectable } from '@nestjs/common';
import { Transfer } from '../../../domain/entities/transfer.entity';
import { TransferRepository } from '../repositories/transfer.repository.interface';

@Injectable()
export class InMemoryTransferRepository implements TransferRepository {
  private readonly transfers: Transfer[] = [];
  private sequence = 1;

  async create(transfer: Transfer): Promise<Transfer> {
    const created = new Transfer(
      this.sequence++,
      transfer.payerId,
      transfer.payeeId,
      transfer.value,
      transfer.status,
      transfer.createdAt,
    );
    this.transfers.push(created);
    return created;
  }
}
