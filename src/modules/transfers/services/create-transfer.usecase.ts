import { Inject, Injectable } from '@nestjs/common';
import { Transfer } from '../../../domain/entities/transfer.entity';
import { DomainError } from '../../../domain/errors/domain-error';
import { TransferStatus } from '../../../domain/enums/transfer-status.enum';
import { TransferPolicy } from '../../../domain/policies/transfer-policy';
import { UserRepository } from '../../users/repositories/user.repository.interface';
import { AuthorizerService } from '../../authz/services/authorizer.service';
import { NotificationService } from '../../notifications/services/notification.service';
import { CreateTransferDto } from '../dto/create-transfer.dto';
import { CacheService } from '../../../infra/cache/cache.service';
import { TransactionManager } from './transaction-manager.interface';

@Injectable()
export class CreateTransferUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('AuthorizerService') private readonly authorizerService: AuthorizerService,
    @Inject('NotificationService') private readonly notificationService: NotificationService,
    @Inject('TransactionManager') private readonly transactionManager: TransactionManager,
    @Inject('CacheService') private readonly cacheService: CacheService,
  ) {}

  async execute(dto: CreateTransferDto): Promise<Transfer> {
    TransferPolicy.validatePayload(dto.value, dto.payer, dto.payee);

    const payer = await this.userRepository.findById(dto.payer);
    if (!payer) {
      throw new DomainError('Pagador nao encontrado.', 404);
    }
    const payee = await this.userRepository.findById(dto.payee);
    if (!payee) {
      throw new DomainError('Recebedor nao encontrado.', 404);
    }

    TransferPolicy.ensurePayerIsCommon(payer);

    const authorized = await this.authorizerService.authorize(payer.id, payee.id, dto.value);
    if (!authorized) {
      throw new DomainError('Transferencia nao autorizada.', 403);
    }

    const transfer = await this.transactionManager.runInTransaction(async ({ walletRepository, transferRepository }) => {
      await walletRepository.lockByUserIds([payer.id, payee.id]);

      const payerWallet = await walletRepository.findByUserId(payer.id);
      const payeeWallet = await walletRepository.findByUserId(payee.id);

      if (!payerWallet || !payeeWallet) {
        throw new DomainError('Carteira nao encontrada.', 404);
      }

      TransferPolicy.ensureSufficientBalance(payerWallet.balance, dto.value);

      payerWallet.balance -= dto.value;
      payeeWallet.balance += dto.value;

      await walletRepository.save(payerWallet);
      await walletRepository.save(payeeWallet);

      const pending = new Transfer(0, payer.id, payee.id, dto.value, TransferStatus.COMPLETED, new Date());
      return transferRepository.create(pending);
    });

    this.notificationService.notifyTransfer(transfer).catch(() => undefined);
    await this.cacheService.del(`wallet:balance:${payer.id}`);
    await this.cacheService.del(`wallet:balance:${payee.id}`);

    return transfer;
  }
}
