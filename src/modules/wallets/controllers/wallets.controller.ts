import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BalanceResponseDto } from '../dto/balance-response.dto';
import { WalletListResponseDto } from '../dto/wallet-list-response.dto';
import { GetBalanceUseCase } from '../services/get-balance.usecase';
import { ListWalletsUseCase } from '../services/list-wallets.usecase';
import { WalletPresenter } from '../services/wallet-presenter';

@ApiTags('wallets')
@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly getBalanceUseCase: GetBalanceUseCase,
    private readonly listWalletsUseCase: ListWalletsUseCase,
  ) { }

  @Get(':userId/balance')
  @ApiOperation({ summary: 'Consultar saldo da carteira' })
  @ApiParam({ name: 'userId', example: '8a7f0f7f-4d1c-4d62-8f24-3f4f0e9f7b0f' })
  @ApiOkResponse({ description: 'Saldo retornado com sucesso.', type: BalanceResponseDto })
  @ApiNotFoundResponse({ description: 'Carteira nao encontrada.' })
  async getBalance(@Param('userId') userId: string): Promise<BalanceResponseDto> {
    const balance = await this.getBalanceUseCase.execute(userId);
    return WalletPresenter.toBalanceResponse(balance);
  }

  @Get()
  @ApiOperation({ summary: 'Listar carteiras' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOkResponse({ description: 'Carteiras listadas com sucesso.', type: WalletListResponseDto })
  async list(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<WalletListResponseDto> {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 10;
    const { items, total, page: currentPage, limit: currentLimit } = await this.listWalletsUseCase.execute(
      pageNumber,
      limitNumber,
    );

    return {
      items: items.map(WalletPresenter.toResponse),
      total,
      page: currentPage,
      limit: currentLimit,
    };
  }
}
