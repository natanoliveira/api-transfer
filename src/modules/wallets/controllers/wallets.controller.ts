import { Controller, Get, Param } from '@nestjs/common';
import { GetBalanceUseCase } from '../services/get-balance.usecase';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly getBalanceUseCase: GetBalanceUseCase) {}

  @Get(':userId/balance')
  async getBalance(@Param('userId') userId: string) {
    return { balance: await this.getBalanceUseCase.execute(Number(userId)) };
  }
}
