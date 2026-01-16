import { Injectable } from '@nestjs/common';
import { AuthorizerService } from '../services/authorizer.service';

@Injectable()
export class MockAuthorizerService implements AuthorizerService {
  async authorize(): Promise<boolean> {
    return true;
  }
}
