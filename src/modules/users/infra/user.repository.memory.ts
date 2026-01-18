import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../repositories/user.repository.interface';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async existsByDocument(document: string): Promise<boolean> {
    for (const user of this.users.values()) {
      if (user.document === document) {
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
    const id = randomUUID();
    const created = new User(id, user.fullName, user.document, user.email, user.passwordHash, user.type);
    this.users.set(id, created);
    return created;
  }

  async findManyPaged(params: { page: number; limit: number }): Promise<{ items: User[]; total: number }> {
    const items = Array.from(this.users.values()).sort((a, b) => a.id.localeCompare(b.id));
    const total = items.length;
    const start = (params.page - 1) * params.limit;
    return { items: items.slice(start, start + params.limit), total };
  }
}
