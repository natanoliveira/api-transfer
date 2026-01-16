import { Transfer } from '../../../domain/entities/transfer.entity';

export interface NotificationService {
  notifyTransfer(transfer: Transfer): Promise<void>;
}
