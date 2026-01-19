import * as request from 'supertest';
import { authHeaders, createTestApp } from './test-setup';

describe('WalletsController', () => {
  it('retorna saldo da carteira', async () => {
    const { app } = await createTestApp();
    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .set(authHeaders())
      .send({
        fullName: 'Joao Souza',
        document: '39053344705',
        email: 'joao@exemplo.com',
        password: 'senha-forte-123',
        type: 'COMMON',
      })
      .expect(201);

    const userId = userResponse.body.id;
    const response = await request(app.getHttpServer())
      .get(`/wallets/${userId}/balance`)
      .set(authHeaders())
      .expect(200);

    expect(response.body).toEqual({ balance: 0 });
    await app.close();
  });

  it('retorna erro quando carteira nao existe', async () => {
    const { app } = await createTestApp();
    const response = await request(app.getHttpServer())
      .get('/wallets/00000000-0000-0000-0000-000000000000/balance')
      .set(authHeaders())
      .expect(404);

    expect(response.body.message).toBe('Carteira nao encontrada.');
    await app.close();
  });

  it('cria deposito via transacao de carteira', async () => {
    const { app } = await createTestApp();
    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .set(authHeaders())
      .send({
        fullName: 'Joao Souza',
        document: '39053344705',
        email: 'joao.tx@exemplo.com',
        password: 'senha-forte-123',
        type: 'COMMON',
      })
      .expect(201);

    const userId = userResponse.body.id;
    const response = await request(app.getHttpServer())
      .post(`/wallets/${userId}/transactions`)
      .set(authHeaders())
      .send({ type: 'deposit', value: 250 })
      .expect(201);

    expect(response.body).toEqual({ balance: 250 });
    await app.close();
  });
});
