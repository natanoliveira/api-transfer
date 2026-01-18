import { BalanceResponseDto } from '../dto/balance-response.dto';
import { WalletResponseDto } from '../dto/wallet-response.dto';
import { Wallet } from '../../../domain/entities/wallet.entity';

export class WalletPresenter {
  static toBalanceResponse(balance: number): BalanceResponseDto {
    return { balance };
  }

  static toResponse(wallet: Wallet): WalletResponseDto {
    return { userId: wallet.userId, balance: wallet.balance };
  }
}
