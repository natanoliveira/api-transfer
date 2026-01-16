import { Injectable } from '@nestjs/common';
import { Prisma, User as PrismaUser } from '@prisma/client';
import { User } from '../../../domain/entities/user.entity';
import { UserType } from '../../../domain/enums/user-type.enum';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { UserRepository } from '../repositories/user.repository.interface';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService | Prisma.TransactionClient) {}

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toDomain(user) : null;
  }

  async existsByCpf(cpf: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { cpf } });
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
        cpf: user.cpf,
        email: user.email,
        passwordHash: user.passwordHash,
        type: user.type,
      },
    });
    return this.toDomain(created);
  }

  private toDomain(user: PrismaUser): User {
    return new User(user.id, user.fullName, user.cpf, user.email, user.passwordHash, user.type as UserType);
  }
}
