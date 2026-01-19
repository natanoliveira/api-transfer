import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTransferDto } from '../dto/create-transfer.dto';
import { TransferListResponseDto } from '../dto/transfer-list-response.dto';
import { TransferResponseDto } from '../dto/transfer-response.dto';
import { CreateTransferUseCase } from '../services/create-transfer.usecase';
import { ListTransfersUseCase } from '../services/list-transfers.usecase';
import { ListUserTransfersUseCase } from '../services/list-user-transfers.usecase';
import { ListUserReceivedTransfersUseCase } from '../services/list-user-received-transfers.usecase';
import { ListUserSentTransfersUseCase } from '../services/list-user-sent-transfers.usecase';
import { TransferPresenter } from '../services/transfer-presenter';

@ApiTags('transfers')
@Controller('transfers')
export class TransfersController {
  constructor(
    private readonly createTransferUseCase: CreateTransferUseCase,
    private readonly listTransfersUseCase: ListTransfersUseCase,
    private readonly listUserTransfersUseCase: ListUserTransfersUseCase,
    private readonly listUserReceivedTransfersUseCase: ListUserReceivedTransfersUseCase,
    private readonly listUserSentTransfersUseCase: ListUserSentTransfersUseCase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Criar transferência' })
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

  @Get('users/:userId')
  @ApiOperation({ summary: 'Listar transferências do usuário' })
  @ApiParam({ name: 'userId', example: '6c53b0fb-0f5f-4c32-82f3-45b71663e9aa' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOkResponse({ description: 'Transferências do usuário listadas com sucesso.', type: TransferListResponseDto })
  async listByUser(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<TransferListResponseDto> {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 10;
    const { items, total, page: currentPage, limit: currentLimit } = await this.listUserTransfersUseCase.execute(
      userId,
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

  @Get('users/:userId/received')
  @ApiOperation({ summary: 'Listar transferências recebidas do usuário' })
  @ApiParam({ name: 'userId', example: '6c53b0fb-0f5f-4c32-82f3-45b71663e9aa' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOkResponse({ description: 'Transferências recebidas listadas com sucesso.', type: TransferListResponseDto })
  async listReceivedByUser(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<TransferListResponseDto> {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 10;
    const { items, total, page: currentPage, limit: currentLimit } =
      await this.listUserReceivedTransfersUseCase.execute(userId, pageNumber, limitNumber);

    return {
      items: items.map(({ transfer, payerName }) => ({
        ...TransferPresenter.toResponse(transfer),
        payerName: payerName ?? undefined,
      })),
      total,
      page: currentPage,
      limit: currentLimit,
    };
  }

  @Get('users/:userId/sent')
  @ApiOperation({ summary: 'Listar transferências enviadas do usuário' })
  @ApiParam({ name: 'userId', example: '6c53b0fb-0f5f-4c32-82f3-45b71663e9aa' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOkResponse({ description: 'Transferências enviadas listadas com sucesso.', type: TransferListResponseDto })
  async listSentByUser(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<TransferListResponseDto> {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 10;
    const { items, total, page: currentPage, limit: currentLimit } =
      await this.listUserSentTransfersUseCase.execute(userId, pageNumber, limitNumber);

    return {
      items: items.map(({ transfer, payeeName }) => ({
        ...TransferPresenter.toResponse(transfer),
        payeeName: payeeName ?? undefined,
      })),
      total,
      page: currentPage,
      limit: currentLimit,
    };
  }
}
