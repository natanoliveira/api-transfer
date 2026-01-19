import { Transfer } from '../../../domain/entities/transfer.entity';

export interface TransferRepository {
  create(transfer: Transfer): Promise<Transfer>;
  findManyPaged(params: { page: number; limit: number }): Promise<{ items: Transfer[]; total: number }>;
  updateNotificationStatus(id: string, status: { sentEmail: boolean; sentSms: boolean }): Promise<void>;
}
