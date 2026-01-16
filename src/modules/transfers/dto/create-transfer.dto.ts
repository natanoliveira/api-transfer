import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateTransferDto {
  @ApiProperty({ example: 100.5 })
  @IsNumber()
  @IsPositive()
  value!: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  payer!: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  payee!: number;
}
