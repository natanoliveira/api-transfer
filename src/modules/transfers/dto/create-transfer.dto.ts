import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateTransferDto {
  @ApiProperty({ example: 100.5 })
  @IsNumber({}, { message: 'Valor deve ser numero.' })
  @IsPositive({ message: 'Valor deve ser maior que zero.' })
  value!: number;

  @ApiProperty({ example: 'c3f6a9b2-5f39-4f3c-9e4a-41c3f2a01b72' })
  @IsUUID(undefined, { message: 'Pagador deve ser um UUID valido.' })
  payer!: string;

  @ApiProperty({ example: 'f5c58d53-4d4b-4b6f-9ef4-1c346c1f0e2a' })
  @IsUUID(undefined, { message: 'Recebedor deve ser um UUID valido.' })
  payee!: string;
}
