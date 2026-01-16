import { Module } from '@nestjs/common';
import { TransfersController } from './controllers/transfers.controller';
import { CreateTransferUseCase } from './services/create-transfer.usecase';
import { PrismaTransferRepository } from './infra/transfer.repository.prisma';
import { PrismaTransactionManager } from './infra/transaction.manager.prisma';
import { UsersModule } from '../users/users.module';
import { WalletsModule } from '../wallets/wallets.module';
import { AuthzModule } from '../authz/authz.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from '../../infra/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule, WalletsModule, AuthzModule, NotificationsModule],
  controllers: [TransfersController],
  providers: [
    CreateTransferUseCase,
    PrismaTransferRepository,
    PrismaTransactionManager,
    { provide: 'TransferRepository', useExisting: PrismaTransferRepository },
    { provide: 'TransactionManager', useExisting: PrismaTransactionManager },
  ],
})
export class TransfersModule {}
