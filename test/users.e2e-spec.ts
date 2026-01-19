import * as request from 'supertest';
import { authHeaders, createTestApp } from './test-setup';

describe('UsersController', () => {
  it('cria usuario com sucesso', async () => {
    const { app } = await createTestApp();
    const response = await request(app.getHttpServer())
      .post('/users')
      .set(authHeaders())
      .set(authHeaders())
      .send({
        fullName: 'Maria Silva',
        document: '52998224725',
        email: 'maria@exemplo.com',
        password: 'senha-forte-123',
        type: 'COMMON',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(String),
      fullName: 'Maria Silva',
      document: '52998224725',
      email: 'maria@exemplo.com',
      type: 'COMMON',
    });

    await app.close();
  });

  it('rejeita documento duplicado', async () => {
    const { app } = await createTestApp();
    const payload = {
      fullName: 'Maria Silva',
      document: '04736744081',
      email: 'maria@exemplo.com',
      password: 'senha-forte-123',
      type: 'COMMON',
    };

    await request(app.getHttpServer()).post('/users').set(authHeaders()).send(payload).expect(201);
    const response = await request(app.getHttpServer())
      .set(authHeaders())
      .post('/users')
      .send({ ...payload, email: 'outra@exemplo.com' })
      .expect(400);

    expect(response.body.message).toBe('Documento ja cadastrado.');
    await app.close();
  });
});
