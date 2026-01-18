import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { CreateUserUseCase } from './services/create-user.usecase';
import { ListUsersUseCase } from './services/list-users.usecase';
import { WalletsModule } from '../wallets/wallets.module';
import { PrismaUserRepository } from './infra/user.repository.prisma';
import { PrismaModule } from '../../infra/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule, WalletsModule],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    ListUsersUseCase,
    PrismaUserRepository,
    { provide: 'UserRepository', useExisting: PrismaUserRepository },
  ],
  exports: [{ provide: 'UserRepository', useExisting: PrismaUserRepository }],
})
export class UsersModule {}
