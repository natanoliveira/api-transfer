import * as request from 'supertest';
import { createTestApp } from './test-setup';

describe('UsersController', () => {
  it('cria usuario com sucesso', async () => {
    const { app } = await createTestApp();
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        fullName: 'Maria Silva',
        cpf: '12345678901',
        email: 'maria@exemplo.com',
        password: 'senha-forte-123',
        type: 'COMMON',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      id: 1,
      fullName: 'Maria Silva',
      cpf: '12345678901',
      email: 'maria@exemplo.com',
      type: 'COMMON',
    });

    await app.close();
  });

  it('rejeita CPF duplicado', async () => {
    const { app } = await createTestApp();
    const payload = {
      fullName: 'Maria Silva',
      cpf: '12345678901',
      email: 'maria@exemplo.com',
      password: 'senha-forte-123',
      type: 'COMMON',
    };

    await request(app.getHttpServer()).post('/users').send(payload).expect(201);
    const response = await request(app.getHttpServer()).post('/users').send({ ...payload, email: 'outra@exemplo.com' }).expect(400);

    expect(response.body.message).toBe('CPF ja cadastrado.');
    await app.close();
  });
});
