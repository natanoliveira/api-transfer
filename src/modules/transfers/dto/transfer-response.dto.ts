import { ApiProperty } from '@nestjs/swagger';
import { TransferStatus } from '../../../domain/enums/transfer-status.enum';

export class TransferResponseDto {
  @ApiProperty({ example: '8a7f0f7f-4d1c-4d62-8f24-3f4f0e9f7b0f' })
  id!: string;

  @ApiProperty({ example: 'c3f6a9b2-5f39-4f3c-9e4a-41c3f2a01b72' })
  payerId!: string;

  @ApiProperty({ example: 'f5c58d53-4d4b-4b6f-9ef4-1c346c1f0e2a' })
  payeeId!: string;

  @ApiProperty({ example: 100.5 })
  value!: number;

  @ApiProperty({ enum: TransferStatus, example: TransferStatus.COMPLETED })
  status!: TransferStatus;

  @ApiProperty({ example: false })
  sentEmail!: boolean;

  @ApiProperty({ example: false })
  sentSms!: boolean;

  @ApiProperty({ example: '2026-01-16T19:10:00.000Z' })
  createdAt!: string;
}
