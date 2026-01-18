import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { TransfersModule } from './modules/transfers/transfers.module';
import { AuthzModule } from './modules/authz/authz.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CacheModule } from './infra/cache/cache.module';
import { MessagingModule } from './infra/messaging/messaging.module';
import { AuditsModule } from './modules/audits/audits.module';

@Module({
  imports: [CacheModule, MessagingModule, AuditsModule, UsersModule, WalletsModule, TransfersModule, AuthzModule, NotificationsModule],
})
export class AppModule {}
