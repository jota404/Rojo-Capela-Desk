const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

const chamadoValido = {
  titulo: 'Computador não liga',
  descricao: 'O computador não inicia.',
  solicitante: 'Ana',
};

beforeEach(() => {
  db.prepare('DELETE FROM chamados').run();
});

describe('API de chamados', () => {
  it('responde 200 no health check com status ok', async () => {
    const resposta = await request(app).get('/api/health');

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body).toEqual({ status: 'ok' });
  });

  it('cria um chamado válido com status aberto por padrão', async () => {
    const resposta = await request(app)
      .post('/api/chamados')
      .send(chamadoValido);

    expect(resposta.statusCode).toBe(201);
    expect(resposta.body.id).toEqual(expect.any(Number));
    expect(resposta.body.status).toBe('aberto');
  });

  it('responde 400 quando o título não é informado', async () => {
    const resposta = await request(app)
      .post('/api/chamados')
      .send({ ...chamadoValido, titulo: undefined });

    expect(resposta.statusCode).toBe(400);
    expect(resposta.body.erro).toMatch(/t[ií]tulo/i);
  });

  it('responde 400 quando a prioridade é inválida', async () => {
    const resposta = await request(app)
      .post('/api/chamados')
      .send({ ...chamadoValido, prioridade: 'urgente' });

    expect(resposta.statusCode).toBe(400);
    expect(resposta.body.erro).toMatch(/prioridade/i);
  });

  it('lista os chamados criados', async () => {
    await request(app).post('/api/chamados').send(chamadoValido);

    const resposta = await request(app).get('/api/chamados');

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body).toHaveLength(1);
    expect(resposta.body[0].titulo).toBe(chamadoValido.titulo);
  });

  it('filtra a listagem por status aberto', async () => {
    await request(app).post('/api/chamados').send(chamadoValido);
    await request(app).post('/api/chamados').send({
      ...chamadoValido,
      titulo: 'Chamado resolvido',
      status: 'resolvido',
    });

    const resposta = await request(app).get('/api/chamados?status=aberto');

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body).toHaveLength(1);
    expect(resposta.body[0].status).toBe('aberto');
  });

  it('responde 404 para um chamado inexistente', async () => {
    const resposta = await request(app).get('/api/chamados/9999');

    expect(resposta.statusCode).toBe(404);
    expect(resposta.body).toEqual({ erro: 'Chamado não encontrado' });
  });

  it('altera o status do chamado para resolvido', async () => {
    const criacao = await request(app)
      .post('/api/chamados')
      .send(chamadoValido);

    const resposta = await request(app)
      .patch(`/api/chamados/${criacao.body.id}/status`)
      .send({ status: 'resolvido' });

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body.status).toBe('resolvido');
  });

  it('responde 400 quando o novo status é inválido', async () => {
    const criacao = await request(app)
      .post('/api/chamados')
      .send(chamadoValido);

    const resposta = await request(app)
      .patch(`/api/chamados/${criacao.body.id}/status`)
      .send({ status: 'cancelado' });

    expect(resposta.statusCode).toBe(400);
    expect(resposta.body.erro).toMatch(/status/i);
  });

  it('exclui um chamado e remove-o da listagem', async () => {
    const criacao = await request(app)
      .post('/api/chamados')
      .send(chamadoValido);

    const exclusao = await request(app)
      .delete(`/api/chamados/${criacao.body.id}`);
    const listagem = await request(app).get('/api/chamados');

    expect(exclusao.statusCode).toBe(204);
    expect(listagem.body).toHaveLength(0);
  });
});
