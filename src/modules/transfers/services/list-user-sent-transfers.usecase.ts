import { Inject, Injectable } from '@nestjs/common';
import { Transfer } from '../../../domain/entities/transfer.entity';
import { DomainError } from '../../../domain/errors/domain-error';
import { UserRepository } from '../../users/repositories/user.repository.interface';
import { TransferRepository } from '../repositories/transfer.repository.interface';

type SentTransfersResult = {
  items: Array<{ transfer: Transfer; payeeName: string | null }>;
  total: number;
  page: number;
  limit: number;
};

@Injectable()
export class ListUserSentTransfersUseCase {
  constructor(
    @Inject('TransferRepository') private readonly transferRepository: TransferRepository,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, page = 1, limit = 10): Promise<SentTransfersResult> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new DomainError('Usuario nao encontrado.', 404);
    }

    const normalizedPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const normalizedLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;
    const boundedLimit = Math.min(normalizedLimit, 100);

    const { items, total } = await this.transferRepository.findManyByPayerPaged({
      userId,
      page: normalizedPage,
      limit: boundedLimit,
    });

    const payeeIds = Array.from(new Set(items.map((transfer) => transfer.payeeId)));
    const payees = await this.userRepository.findManyByIds(payeeIds);
    const payeeNames = new Map(payees.map((payee) => [payee.id, payee.fullName]));

    return {
      items: items.map((transfer) => ({
        transfer,
        payeeName: payeeNames.get(transfer.payeeId) ?? null,
      })),
      total,
      page: normalizedPage,
      limit: boundedLimit,
    };
  }
}
