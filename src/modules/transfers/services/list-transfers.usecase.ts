import { Inject, Injectable } from '@nestjs/common';
import { Transfer } from '../../../domain/entities/transfer.entity';
import { TransferRepository } from '../repositories/transfer.repository.interface';

@Injectable()
export class ListTransfersUseCase {
  constructor(@Inject('TransferRepository') private readonly transferRepository: TransferRepository) {}

  async execute(page = 1, limit = 10): Promise<{ items: Transfer[]; total: number; page: number; limit: number }> {
    const normalizedPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const normalizedLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;
    const boundedLimit = Math.min(normalizedLimit, 100);

    const { items, total } = await this.transferRepository.findManyPaged({
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
