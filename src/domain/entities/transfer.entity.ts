import { TransferStatus } from '../enums/transfer-status.enum';

export class Transfer {
  constructor(
    public readonly id: number,
    public readonly payerId: number,
    public readonly payeeId: number,
    public readonly value: number,
    public readonly status: TransferStatus,
    public readonly createdAt: Date,
  ) {}
}
