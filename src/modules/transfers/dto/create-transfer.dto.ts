import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateTransferDto {
  @ApiProperty({ example: 100.5 })
  @IsNumber({}, { message: 'Valor deve ser numero.' })
  @IsPositive({ message: 'Valor deve ser maior que zero.' })
  value!: number;

  @ApiProperty({ example: 1 })
  @IsNumber({}, { message: 'Pagador deve ser numero.' })
  payer!: number;

  @ApiProperty({ example: 2 })
  @IsNumber({}, { message: 'Recebedor deve ser numero.' })
  payee!: number;
}
