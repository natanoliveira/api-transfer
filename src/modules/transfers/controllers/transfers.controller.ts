import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTransferDto } from '../dto/create-transfer.dto';
import { TransferResponseDto } from '../dto/transfer-response.dto';
import { CreateTransferUseCase } from '../services/create-transfer.usecase';
import { TransferPresenter } from '../services/transfer-presenter';

@ApiTags('transfers')
@Controller('transfer')
export class TransfersController {
  constructor(private readonly createTransferUseCase: CreateTransferUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Criar transferencia' })
  @ApiBody({ type: CreateTransferDto })
  @ApiCreatedResponse({ description: 'Transferencia criada com sucesso.', type: TransferResponseDto })
  @ApiBadRequestResponse({ description: 'Dados invalidos ou saldo insuficiente.' })
  @ApiForbiddenResponse({ description: 'Transferencia nao autorizada.' })
  async create(@Body() dto: CreateTransferDto): Promise<TransferResponseDto> {
    const transfer = await this.createTransferUseCase.execute(dto);
    return TransferPresenter.toResponse(transfer);
  }
}
