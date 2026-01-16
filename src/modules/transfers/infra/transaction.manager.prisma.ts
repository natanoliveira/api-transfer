import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { PrismaWalletRepository } from '../../wallets/infra/wallet.repository.prisma';
import { PrismaTransferRepository } from './transfer.repository.prisma';
import { TransactionContext, TransactionManager } from '../services/transaction-manager.interface';

@Injectable()
export class PrismaTransactionManager implements TransactionManager {
  constructor(private readonly prisma: PrismaService) {}

  async runInTransaction<T>(fn: (ctx: TransactionContext) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const walletRepository = new PrismaWalletRepository(tx);
      const transferRepository = new PrismaTransferRepository(tx);
      return fn({ walletRepository, transferRepository });
    });
  }
}
