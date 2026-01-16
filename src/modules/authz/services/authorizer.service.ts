export interface AuthorizerService {
  authorize(payerId: number, payeeId: number, value: number): Promise<boolean>;
}
