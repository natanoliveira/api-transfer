import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTransferDto } from '../dto/create-transfer.dto';
import { TransferListResponseDto } from '../dto/transfer-list-response.dto';
import { TransferResponseDto } from '../dto/transfer-response.dto';
import { CreateTransferUseCase } from '../services/create-transfer.usecase';
import { ListTransfersUseCase } from '../services/list-transfers.usecase';
import { TransferPresenter } from '../services/transfer-presenter';

@ApiTags('transfers')
@Controller('transfer')
export class TransfersController {
  constructor(
    private readonly createTransferUseCase: CreateTransferUseCase,
    private readonly listTransfersUseCase: ListTransfersUseCase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Criar transferencia' })
  @ApiBody({ type: CreateTransferDto })
  @ApiCreatedResponse({ description: 'Transferência criada com sucesso.', type: TransferResponseDto })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou saldo insuficiente.' })
  @ApiForbiddenResponse({ description: 'Transferência não autorizada.' })
  async create(@Body() dto: CreateTransferDto): Promise<TransferResponseDto> {
    const transfer = await this.createTransferUseCase.execute(dto);
    return TransferPresenter.toResponse(transfer);
  }

  @Get()
  @ApiOperation({ summary: 'Listar transferências' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOkResponse({ description: 'Transferências listadas com sucesso.', type: TransferListResponseDto })
  async list(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<TransferListResponseDto> {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 10;
    const { items, total, page: currentPage, limit: currentLimit } = await this.listTransfersUseCase.execute(
      pageNumber,
      limitNumber,
    );

    return {
      items: items.map(TransferPresenter.toResponse),
      total,
      page: currentPage,
      limit: currentLimit,
    };
  }
}
