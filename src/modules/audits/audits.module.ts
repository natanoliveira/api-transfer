import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infra/database/prisma/prisma.module';
import { PrismaTransferAuditRepository } from './infra/transfer-audit.repository.prisma';
import { TransferAuditConsumer } from './infra/transfer-audit.consumer';
import { TransferAuditService } from './services/transfer-audit.service';

@Module({
  imports: [PrismaModule],
  providers: [
    TransferAuditService,
    PrismaTransferAuditRepository,
    TransferAuditConsumer,
    { provide: 'TransferAuditRepository', useExisting: PrismaTransferAuditRepository },
  ],
})
export class AuditsModule {}
