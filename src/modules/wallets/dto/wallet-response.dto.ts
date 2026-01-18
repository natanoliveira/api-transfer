import { ApiProperty } from '@nestjs/swagger';

export class WalletResponseDto {
  @ApiProperty({ example: '8a7f0f7f-4d1c-4d62-8f24-3f4f0e9f7b0f' })
  userId!: string;

  @ApiProperty({ example: 250.75 })
  balance!: number;
}
