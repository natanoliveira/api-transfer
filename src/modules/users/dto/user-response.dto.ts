import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../../../domain/enums/user-type.enum';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Maria Silva' })
  fullName!: string;

  @ApiProperty({ example: '12345678901' })
  cpf!: string;

  @ApiProperty({ example: 'maria@exemplo.com' })
  email!: string;

  @ApiProperty({ enum: UserType, example: UserType.COMMON })
  type!: UserType;
}
