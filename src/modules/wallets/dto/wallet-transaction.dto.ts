import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { WalletTransactionType } from '../../../domain/enums/wallet-type.enum';

export class WalletTransactionDto {
  @ApiProperty({ example: WalletTransactionType.DEPOSIT, enum: WalletTransactionType })
  @IsEnum(WalletTransactionType, { message: 'Tipo de transacao invalido.' })
  type!: WalletTransactionType;

  @ApiProperty({ example: 150.75 })
  @IsNumber({}, { message: 'Valor deve ser numero.' })
  @IsPositive({ message: 'Valor deve ser maior que zero.' })
  value!: number;
}
