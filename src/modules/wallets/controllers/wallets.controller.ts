import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { BalanceResponseDto } from '../dto/balance-response.dto';
import { GetBalanceUseCase } from '../services/get-balance.usecase';
import { WalletPresenter } from '../services/wallet-presenter';

@ApiTags('wallets')
@Controller('wallets')
export class WalletsController {
  constructor(private readonly getBalanceUseCase: GetBalanceUseCase) {}

  @Get(':userId/balance')
  @ApiOperation({ summary: 'Consultar saldo da carteira' })
  @ApiParam({ name: 'userId', example: 1 })
  @ApiOkResponse({ description: 'Saldo retornado com sucesso.', type: BalanceResponseDto })
  @ApiNotFoundResponse({ description: 'Carteira nao encontrada.' })
  async getBalance(@Param('userId') userId: string): Promise<BalanceResponseDto> {
    const balance = await this.getBalanceUseCase.execute(Number(userId));
    return WalletPresenter.toBalanceResponse(balance);
  }
}
