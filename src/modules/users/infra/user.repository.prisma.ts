import { Inject, Injectable } from '@nestjs/common';
import { Prisma, User as PrismaUser } from '@prisma/client';
import { User } from '../../../domain/entities/user.entity';
import { UserType } from '../../../domain/enums/user-type.enum';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { UserRepository } from '../repositories/user.repository.interface';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService | Prisma.TransactionClient) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toDomain(user) : null;
  }

  async existsByDocument(document: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { document } });
    return count > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { email } });
    return count > 0;
  }

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        fullName: user.fullName,
        document: user.document,
        email: user.email,
        passwordHash: user.passwordHash,
        type: user.type,
      },
    });
    return this.toDomain(created);
  }

  async findManyPaged(params: { page: number; limit: number }): Promise<{ items: User[]; total: number }> {
    const skip = (params.page - 1) * params.limit;
    const take = params.limit;
    const items = await this.prisma.user.findMany({ skip, take, orderBy: { id: 'asc' } });
    const total = await this.prisma.user.count();
    return { items: items.map((user) => this.toDomain(user)), total };
  }

  private toDomain(user: PrismaUser): User {
    return new User(user.id, user.fullName, user.document, user.email, user.passwordHash, user.type as UserType);
  }
}
