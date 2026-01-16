import { UserType } from '../enums/user-type.enum';

export class User {
  constructor(
    public readonly id: number,
    public readonly fullName: string,
    public readonly cpf: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly type: UserType,
  ) {}
}
