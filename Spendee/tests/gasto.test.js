const request = require('supertest');
const app = require('../index');

describe('API de Gastos', () => {
  it('GET /gastos debería devolver un array', async () => {
    const res = await request(app).get('/gastos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /gasto sin JWT debe fallar', async () => {
    const res = await request(app)
      .post('/gasto')
      .send({ userId: 'test', gasto: 100, montoAnterior: 50 });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Token no proporcionado');
  });
});
