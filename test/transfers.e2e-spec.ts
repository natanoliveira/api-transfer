import * as request from 'supertest';
import { Wallet } from '../src/domain/entities/wallet.entity';
import { authHeaders, createTestApp } from './test-setup';

describe('TransfersController', () => {
  it('cria transferencia com sucesso', async () => {
    const { app, walletRepository } = await createTestApp();
    const payerResponse = await request(app.getHttpServer())
      .post('/users')
      .set(authHeaders())
      .send({
        fullName: 'Ana Lima',
        document: '52998224725',
        email: 'ana@exemplo.com',
        password: 'senha-forte-123',
        type: 'COMMON',
      })
      .expect(201);
    const payeeResponse = await request(app.getHttpServer())
      .post('/users')
      .set(authHeaders())
      .send({
        fullName: 'Loja XPTO',
        document: '11222333000181',
        email: 'loja@exemplo.com',
        password: 'senha-forte-123',
        type: 'MERCHANT',
      })
      .expect(201);

    await walletRepository.save(new Wallet(payerResponse.body.id, 200));

    const response = await request(app.getHttpServer())
      .post('/transfers')
      .set(authHeaders())
      .send({
        value: 50,
        payer: payerResponse.body.id,
        payee: payeeResponse.body.id,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      payerId: payerResponse.body.id,
      payeeId: payeeResponse.body.id,
      value: 50,
      status: 'COMPLETED',
    });

    await app.close();
  });

  it('rejeita transferencia sem saldo', async () => {
    const { app } = await createTestApp();
    const payerResponse = await request(app.getHttpServer())
      .post('/users')
      .set(authHeaders())
      .send({
        fullName: 'Carlos Souza',
        document: '39053344705',
        email: 'carlos@exemplo.com',
        password: 'senha-forte-123',
        type: 'COMMON',
      })
      .expect(201);
    const payeeResponse = await request(app.getHttpServer())
      .post('/users')
      .set(authHeaders())
      .send({
        fullName: 'Paula Martins',
        document: '16899535009',
        email: 'paula@exemplo.com',
        password: 'senha-forte-123',
        type: 'COMMON',
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/transfers')
      .set(authHeaders())
      .send({
        value: 10,
        payer: payerResponse.body.id,
        payee: payeeResponse.body.id,
      })
      .expect(400);

    expect(response.body.message).toBe('Saldo insuficiente.');
    await app.close();
  });
});
