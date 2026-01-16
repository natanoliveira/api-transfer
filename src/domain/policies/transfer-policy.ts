import { User } from '../entities/user.entity';
import { DomainError } from '../errors/domain-error';
import { UserType } from '../enums/user-type.enum';

export class TransferPolicy {
  static validatePayload(value: number, payerId: number, payeeId: number) {
    if (value <= 0) {
      throw new DomainError('Transfer value must be greater than zero.');
    }
    if (payerId === payeeId) {
      throw new DomainError('Payer and payee must be different.');
    }
  }

  static ensurePayerIsCommon(payer: User) {
    if (payer.type === UserType.MERCHANT) {
      throw new DomainError('Merchant users cannot send transfers.');
    }
  }

  static ensureSufficientBalance(balance: number, value: number) {
    if (balance < value) {
      throw new DomainError('Insufficient balance.');
    }
  }
}
