import { IsNumber, IsPositive } from 'class-validator';

export class CreateTransferDto {
  @IsNumber()
  @IsPositive()
  value!: number;

  @IsNumber()
  payer!: number;

  @IsNumber()
  payee!: number;
}
