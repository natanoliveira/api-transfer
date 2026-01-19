import { Transfer } from '../../../domain/entities/transfer.entity';
import { TransferResponseDto } from '../dto/transfer-response.dto';

export class TransferPresenter {
  static toResponse(transfer: Transfer): TransferResponseDto {
    return {
      id: transfer.id,
      payerId: transfer.payerId,
      payeeId: transfer.payeeId,
      value: transfer.value,
      status: transfer.status,
      sentEmail: transfer.sentEmail,
      sentSms: transfer.sentSms,
      createdAt: transfer.createdAt.toISOString(),
    };
  }
}
