import { User } from '../../../domain/entities/user.entity';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findManyByIds(ids: string[]): Promise<User[]>;
  existsByDocument(document: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  create(user: User): Promise<User>;
  findManyPaged(params: { page: number; limit: number }): Promise<{ items: User[]; total: number }>;
}
