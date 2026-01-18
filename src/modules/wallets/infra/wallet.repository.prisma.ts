import { Inject, Injectable } from '@nestjs/common';
import { Prisma, Wallet as PrismaWallet } from '@prisma/client';
import { Wallet } from '../../../domain/entities/wallet.entity';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { WalletRepository } from '../repositories/wallet.repository.interface';

@Injectable()
export class PrismaWalletRepository implements WalletRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService | Prisma.TransactionClient) {}

  async findByUserId(userId: number): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    return wallet ? this.toDomain(wallet) : null;
  }

  async save(wallet: Wallet): Promise<Wallet> {
    const updated = await this.prisma.wallet.update({
      where: { userId: wallet.userId },
      data: { balance: wallet.balance },
    });
    return this.toDomain(updated);
  }

  async createForUser(userId: number): Promise<Wallet> {
    const created = await this.prisma.wallet.create({
      data: { userId },
    });
    return this.toDomain(created);
  }

  async lockByUserIds(userIds: number[]): Promise<void> {
    if (userIds.length === 0) {
      return;
    }
    await this.prisma.$executeRaw`
      SELECT id
      FROM "Wallet"
      WHERE "userId" IN (${Prisma.join(userIds)})
      FOR UPDATE
    `;
  }

  private toDomain(wallet: PrismaWallet): Wallet {
    return new Wallet(wallet.userId, Number(wallet.balance));
  }
}
