import { Module } from '@nestjs/common';
import { WalletsController } from './controllers/wallets.controller';
import { CreateWalletTransactionUseCase } from './services/create-wallet-transaction.usecase';
import { GetBalanceUseCase } from './services/get-balance.usecase';
import { ListWalletsUseCase } from './services/list-wallets.usecase';
import { PrismaWalletRepository } from './infra/wallet.repository.prisma';
import { PrismaModule } from '../../infra/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WalletsController],
  providers: [
    CreateWalletTransactionUseCase,
    GetBalanceUseCase,
    ListWalletsUseCase,
    PrismaWalletRepository,
    { provide: 'WalletRepository', useExisting: PrismaWalletRepository },
  ],
  exports: [{ provide: 'WalletRepository', useExisting: PrismaWalletRepository }],
})
export class WalletsModule {}
