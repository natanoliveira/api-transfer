import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { DomainError } from '../../../domain/errors/domain-error';
import { UserType } from '../../../domain/enums/user-type.enum';
import { isValidCnpj, isValidCpf } from '../../../domain/validators/br-document.validator';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from '../repositories/user.repository.interface';
import { WalletRepository } from '../../wallets/repositories/wallet.repository.interface';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('WalletRepository') private readonly walletRepository: WalletRepository,
  ) { }

  async execute(dto: CreateUserDto): Promise<User> {
    const isMerchant = dto.type === UserType.MERCHANT;
    const isValidDocument = isMerchant ? isValidCnpj(dto.document) : isValidCpf(dto.document);
    if (!isValidDocument) {
      throw new DomainError(isMerchant ? 'CNPJ invalido.' : 'CPF invalido.');
    }

    if (await this.userRepository.existsByDocument(dto.document)) {
      throw new DomainError('CPF/CNPJ ja cadastrado.');
    }
    if (await this.userRepository.existsByEmail(dto.email)) {
      throw new DomainError('E-mail ja cadastrado.');
    }

    const passwordHash = `hashed:${dto.password}`;
    const user = new User('', dto.fullName, dto.document, dto.email, passwordHash, dto.type);
    const created = await this.userRepository.create(user);
    await this.walletRepository.createForUser(created.id);
    return created;
  }
}
