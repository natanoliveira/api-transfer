import { Module } from '@nestjs/common';
import { WalletsController } from './controllers/wallets.controller';
import { GetBalanceUseCase } from './services/get-balance.usecase';
import { PrismaWalletRepository } from './infra/wallet.repository.prisma';
import { PrismaModule } from '../../infra/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WalletsController],
  providers: [GetBalanceUseCase, PrismaWalletRepository, { provide: 'WalletRepository', useExisting: PrismaWalletRepository }],
  exports: [{ provide: 'WalletRepository', useExisting: PrismaWalletRepository }],
})
export class WalletsModule {}
