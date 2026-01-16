import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../repositories/user.repository.interface';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<number, User>();
  private sequence = 1;

  async findById(id: number): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async existsByCpf(cpf: string): Promise<boolean> {
    for (const user of this.users.values()) {
      if (user.cpf === cpf) {
        return true;
      }
    }
    return false;
  }

  async existsByEmail(email: string): Promise<boolean> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return true;
      }
    }
    return false;
  }

  async create(user: User): Promise<User> {
    const id = this.sequence++;
    const created = new User(id, user.fullName, user.cpf, user.email, user.passwordHash, user.type);
    this.users.set(id, created);
    return created;
  }
}
