import { ApiProperty } from '@nestjs/swagger';
import { TransferResponseDto } from './transfer-response.dto';

export class TransferListResponseDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 1 })
  total!: number;

  @ApiProperty({ type: [TransferResponseDto] })
  items!: TransferResponseDto[];
}
