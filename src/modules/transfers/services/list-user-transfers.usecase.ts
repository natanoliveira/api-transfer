import { Inject, Injectable } from '@nestjs/common';
import { Transfer } from '../../../domain/entities/transfer.entity';
import { DomainError } from '../../../domain/errors/domain-error';
import { UserRepository } from '../../users/repositories/user.repository.interface';
import { TransferRepository } from '../repositories/transfer.repository.interface';

@Injectable()
export class ListUserTransfersUseCase {
  constructor(
    @Inject('TransferRepository') private readonly transferRepository: TransferRepository,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{ items: Transfer[]; total: number; page: number; limit: number }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new DomainError('Usuario nao encontrado.', 404);
    }

    const normalizedPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const normalizedLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;
    const boundedLimit = Math.min(normalizedLimit, 100);

    const { items, total } = await this.transferRepository.findManyByUserPaged({
      userId,
      page: normalizedPage,
      limit: boundedLimit,
    });

    return {
      items,
      total,
      page: normalizedPage,
      limit: boundedLimit,
    };
  }
}
