import { ApiProperty } from '@nestjs/swagger';
import { TransferStatus } from '../../../domain/enums/transfer-status.enum';

export class TransferResponseDto {
  @ApiProperty({ example: 10 })
  id!: number;

  @ApiProperty({ example: 1 })
  payerId!: number;

  @ApiProperty({ example: 2 })
  payeeId!: number;

  @ApiProperty({ example: 100.5 })
  value!: number;

  @ApiProperty({ enum: TransferStatus, example: TransferStatus.COMPLETED })
  status!: TransferStatus;

  @ApiProperty({ example: '2026-01-16T19:10:00.000Z' })
  createdAt!: string;
}
