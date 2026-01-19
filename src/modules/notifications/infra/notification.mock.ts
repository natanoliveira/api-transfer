import { Injectable, Logger } from '@nestjs/common';
import { Transfer } from '../../../domain/entities/transfer.entity';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class MockNotificationService implements NotificationService {
  private readonly logger = new Logger(MockNotificationService.name);

  private getUrl(): string {
    return process.env.NOTIFY_URL ?? 'https://util.devi.tools/api/v1/notify';
  }

  async notifyTransfer(transfer: Transfer, recipientEmail: string): Promise<{ status: string; message?: string }> {
    const url = this.getUrl();
    const mockEmail = recipientEmail;
    const mockSms = '+55 11 90000-0000';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transferId: transfer.id,
          payerId: transfer.payerId,
          payeeId: transfer.payeeId,
          value: transfer.value,
          status: transfer.status,
          email: mockEmail,
          sms: mockSms,
        }),
      });

      if (!response.ok) {
        return { status: 'fail', message: 'Servico de notificacao indisponivel.' };
      }
      const payload = (await response.json()) as { status?: string; data?: { message?: string } };
      const status = payload.status ?? 'fail';
      const message = payload.data?.message;
      if (status !== 'success') {
        this.logger.error(`Falha no envio de notificacao para email ${mockEmail} e sms ${mockSms}.`);
      }
      return { status, message };
    } catch (error) {
      const err = error as Error;
      this.logger.warn(`Falha ao enviar notificacao: ${err.message}`);
      return { status: 'fail', message: 'Servico de notificacao indisponivel.' };
    }
  }
}
