import { User } from '../../../domain/entities/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';

export class UserPresenter {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      fullName: user.fullName,
      cpf: user.cpf,
      email: user.email,
      type: user.type,
    };
  }
}
