import { Body, Controller, Post } from '@nestjs/common';
import { CreateTransferDto } from '../dto/create-transfer.dto';
import { CreateTransferUseCase } from '../services/create-transfer.usecase';

@Controller('transfer')
export class TransfersController {
  constructor(private readonly createTransferUseCase: CreateTransferUseCase) {}

  @Post()
  async create(@Body() dto: CreateTransferDto) {
    return this.createTransferUseCase.execute(dto);
  }
}
