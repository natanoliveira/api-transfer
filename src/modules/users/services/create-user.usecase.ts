import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { DomainError } from '../../../domain/errors/domain-error';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from '../repositories/user.repository.interface';
import { WalletRepository } from '../../wallets/repositories/wallet.repository.interface';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('WalletRepository') private readonly walletRepository: WalletRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    if (await this.userRepository.existsByCpf(dto.cpf)) {
      throw new DomainError('CPF ja cadastrado.');
    }
    if (await this.userRepository.existsByEmail(dto.email)) {
      throw new DomainError('Email ja cadastrado.');
    }

    const passwordHash = `hashed:${dto.password}`;
    const user = new User(0, dto.fullName, dto.cpf, dto.email, passwordHash, dto.type);
    const created = await this.userRepository.create(user);
    await this.walletRepository.createForUser(created.id);
    return created;
  }
}
