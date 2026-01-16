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
import { CreateTransferUseCase } from '../services/create-transfer.usecase';

@ApiTags('transfers')
@Controller('transfer')
export class TransfersController {
  constructor(private readonly createTransferUseCase: CreateTransferUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Criar transferencia' })
  @ApiBody({ type: CreateTransferDto })
  @ApiCreatedResponse({ description: 'Transferencia criada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados invalidos ou saldo insuficiente.' })
  @ApiForbiddenResponse({ description: 'Transferencia nao autorizada.' })
  async create(@Body() dto: CreateTransferDto) {
    return this.createTransferUseCase.execute(dto);
  }
}
