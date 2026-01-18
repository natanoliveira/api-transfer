import { TransferStatus } from '../enums/transfer-status.enum';

export class Transfer {
  constructor(
    public readonly id: string,
    public readonly payerId: string,
    public readonly payeeId: string,
    public readonly value: number,
    public readonly status: TransferStatus,
    public readonly createdAt: Date,
  ) {}
}
