import request from 'supertest';
import { Wallet } from '../src/domain/entities/wallet.entity';
import { createTestApp } from './test-setup';

describe('TransfersController', () => {
  it('cria transferencia com sucesso', async () => {
    const { app, walletRepository } = await createTestApp();
    const payerResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        fullName: 'Ana Lima',
        cpf: '11122233344',
        email: 'ana@exemplo.com',
        password: 'senha-forte-123',
        type: 'COMMON',
      })
      .expect(201);
    const payeeResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        fullName: 'Loja XPTO',
        cpf: '55566677788',
        email: 'loja@exemplo.com',
        password: 'senha-forte-123',
        type: 'MERCHANT',
      })
      .expect(201);

    await walletRepository.save(new Wallet(payerResponse.body.id, 200));

    const response = await request(app.getHttpServer())
      .post('/transfer')
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
      .send({
        fullName: 'Carlos Souza',
        cpf: '99988877766',
        email: 'carlos@exemplo.com',
        password: 'senha-forte-123',
        type: 'COMMON',
      })
      .expect(201);
    const payeeResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        fullName: 'Paula Martins',
        cpf: '22233344455',
        email: 'paula@exemplo.com',
        password: 'senha-forte-123',
        type: 'COMMON',
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/transfer')
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
