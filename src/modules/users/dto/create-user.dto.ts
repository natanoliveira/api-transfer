import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserType } from '../../../domain/enums/user-type.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Maria Silva' })
  @IsString({ message: 'Nome completo deve ser texto.' })
  @IsNotEmpty({ message: 'Nome completo e obrigatorio.' })
  fullName!: string;

  @ApiProperty({ example: '12345678901' })
  @IsString({ message: 'CPF deve ser texto.' })
  @IsNotEmpty({ message: 'CPF e obrigatorio.' })
  cpf!: string;

  @ApiProperty({ example: 'maria@exemplo.com' })
  @IsEmail({}, { message: 'Email invalido.' })
  email!: string;

  @ApiProperty({ example: 'senha-forte-123' })
  @IsString({ message: 'Senha deve ser texto.' })
  @MinLength(8, { message: 'Senha deve ter no minimo 8 caracteres.' })
  password!: string;

  @ApiProperty({ enum: UserType, example: UserType.COMMON })
  @IsEnum(UserType, { message: 'Tipo de usuario invalido.' })
  type!: UserType;
}
