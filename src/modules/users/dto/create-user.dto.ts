import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserType } from '../../../domain/enums/user-type.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Maria Silva' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: '12345678901' })
  @IsString()
  @IsNotEmpty()
  cpf!: string;

  @ApiProperty({ example: 'maria@exemplo.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'senha-forte-123' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: UserType, example: UserType.COMMON })
  @IsEnum(UserType)
  type!: UserType;
}
