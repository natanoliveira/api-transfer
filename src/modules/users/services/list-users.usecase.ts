import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../repositories/user.repository.interface';

@Injectable()
export class ListUsersUseCase {
  constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {}

  async execute(
    page = 1,
    limit = 10,
  ): Promise<{ items: User[]; total: number; page: number; limit: number }> {
    const normalizedPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const normalizedLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;
    const boundedLimit = Math.min(normalizedLimit, 100);

    const { items, total } = await this.userRepository.findManyPaged({
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
