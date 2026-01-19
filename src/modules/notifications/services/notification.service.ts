import { Transfer } from '../../../domain/entities/transfer.entity';

export interface NotificationService {
  notifyTransfer(transfer: Transfer, recipientEmail: string): Promise<{ status: string; message?: string }>;
}
