import { BalanceResponseDto } from '../dto/balance-response.dto';

export class WalletPresenter {
  static toBalanceResponse(balance: number): BalanceResponseDto {
    return { balance };
  }
}
