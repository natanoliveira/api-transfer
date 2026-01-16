import { Module } from '@nestjs/common';
import { MockAuthorizerService } from './infra/authorizer.mock';

@Module({
  providers: [MockAuthorizerService, { provide: 'AuthorizerService', useExisting: MockAuthorizerService }],
  exports: [{ provide: 'AuthorizerService', useExisting: MockAuthorizerService }],
})
export class AuthzModule {}
