import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/infra/http/app-setup';
import { PrismaService } from '../src/infra/database/prisma/prisma.service';
import { InMemoryUserRepository } from '../src/modules/users/infra/user.repository.memory';
import { InMemoryWalletRepository } from '../src/modules/wallets/infra/wallet.repository.memory';
import { InMemoryTransferRepository } from '../src/modules/transfers/infra/transfer.repository.memory';

class MockPrismaService {}

export async function createTestApp(): Promise<{
  app: INestApplication;
  userRepository: InMemoryUserRepository;
  walletRepository: InMemoryWalletRepository;
  transferRepository: InMemoryTransferRepository;
}> {
  process.env.RABBITMQ_ENABLED = 'false';

  const userRepository = new InMemoryUserRepository();
  const walletRepository = new InMemoryWalletRepository();
  const transferRepository = new InMemoryTransferRepository();

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider('UserRepository')
    .useValue(userRepository)
    .overrideProvider('WalletRepository')
    .useValue(walletRepository)
    .overrideProvider('TransferRepository')
    .useValue(transferRepository)
    .overrideProvider('TransactionManager')
    .useValue({
      runInTransaction: async (fn: (ctx: { walletRepository: InMemoryWalletRepository; transferRepository: InMemoryTransferRepository }) => Promise<unknown>) =>
        fn({ walletRepository, transferRepository }),
    })
    .overrideProvider('AuthorizerService')
    .useValue({ authorize: async () => true })
    .overrideProvider('NotificationService')
    .useValue({ notifyTransfer: async () => undefined })
    .overrideProvider(PrismaService)
    .useValue(new MockPrismaService())
    .compile();

  const app = moduleRef.createNestApplication();
  configureApp(app);
  await app.init();

  return { app, userRepository, walletRepository, transferRepository };
}
