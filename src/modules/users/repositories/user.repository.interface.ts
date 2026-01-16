import { User } from '../../../domain/entities/user.entity';

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  existsByCpf(cpf: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  create(user: User): Promise<User>;
}
