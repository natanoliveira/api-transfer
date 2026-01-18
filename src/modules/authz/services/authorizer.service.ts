export interface AuthorizerService {
  authorize(payerId: string, payeeId: string, value: number): Promise<boolean>;
}
