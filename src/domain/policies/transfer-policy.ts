import { User } from '../entities/user.entity';
import { DomainError } from '../errors/domain-error';
import { UserType } from '../enums/user-type.enum';

export class TransferPolicy {
  static validatePayload(value: number, payerId: string, payeeId: string) {
    if (value <= 0) {
      throw new DomainError('O valor da transferência deve ser maior que zero.');
    }
    if (payerId === payeeId) {
      throw new DomainError('Pagador e recebedor devem ser diferentes.');
    }
  }

  static ensurePayerIsCommon(payer: User) {
    if (payer.type === UserType.MERCHANT) {
      throw new DomainError('Usuarios lojistas não podem enviar transferencias.');
    }
  }

  static ensureSufficientBalance(balance: number, value: number) {
    if (balance < value) {
      throw new DomainError('Saldo insuficiente.');
    }
  }
}
