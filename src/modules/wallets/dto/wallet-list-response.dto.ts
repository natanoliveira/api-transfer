import { ApiProperty } from '@nestjs/swagger';
import { WalletResponseDto } from './wallet-response.dto';

export class WalletListResponseDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 1 })
  total!: number;

  @ApiProperty({ type: [WalletResponseDto] })
  items!: WalletResponseDto[];
}
