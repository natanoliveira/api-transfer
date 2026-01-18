import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../../../domain/enums/user-type.enum';

export class UserResponseDto {
  @ApiProperty({ example: '8a7f0f7f-4d1c-4d62-8f24-3f4f0e9f7b0f' })
  id!: string;

  @ApiProperty({ example: 'Maria Silva' })
  fullName!: string;

  @ApiProperty({ example: '12345678901' })
  document!: string;

  @ApiProperty({ example: 'maria@exemplo.com' })
  email!: string;

  @ApiProperty({ enum: UserType, example: UserType.COMMON })
  type!: UserType;
}
