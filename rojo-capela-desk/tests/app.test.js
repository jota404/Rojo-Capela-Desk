const request = require('supertest');
const app = require('../server/app');
const db = require('../server/db');

beforeEach(() => {
  db.prepare('DELETE FROM chamados').run();
});

describe('API', () => {
  test('GET /api/health responde com status ok', async () => {
    const resposta = await request(app).get('/api/health');

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body).toEqual({ status: 'ok' });
  });

  test('cria e consulta um chamado com valores padrão', async () => {
    const criacao = await request(app)
      .post('/api/chamados')
      .send({
        titulo: 'Computador não liga',
        descricao: 'O computador não inicia.',
        solicitante: 'Ana',
      });

    expect(criacao.statusCode).toBe(201);
    expect(criacao.body.prioridade).toBe('media');
    expect(criacao.body.status).toBe('aberto');
    expect(criacao.body.criado_em).toEqual(expect.any(String));

    const consulta = await request(app).get(`/api/chamados/${criacao.body.id}`);

    expect(consulta.statusCode).toBe(200);
    expect(consulta.body.titulo).toBe('Computador não liga');
  });

  test('lista chamados com filtros de status e prioridade', async () => {
    await request(app).post('/api/chamados').send({
      titulo: 'Chamado aberto',
      descricao: 'Descrição',
      solicitante: 'Ana',
      prioridade: 'alta',
    });
    await request(app).post('/api/chamados').send({
      titulo: 'Chamado resolvido',
      descricao: 'Descrição',
      solicitante: 'Bruno',
      prioridade: 'baixa',
      status: 'resolvido',
    });

    const resposta = await request(app).get('/api/chamados?status=aberto&prioridade=alta');

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body).toHaveLength(1);
    expect(resposta.body[0].titulo).toBe('Chamado aberto');
  });

  test('rejeita dados obrigatórios vazios e opções inválidas', async () => {
    const semDados = await request(app).post('/api/chamados').send({
      titulo: '   ',
      descricao: 'Descrição',
      solicitante: 'Ana',
    });
    const prioridadeInvalida = await request(app).post('/api/chamados').send({
      titulo: 'Título',
      descricao: 'Descrição',
      solicitante: 'Ana',
      prioridade: 'urgente',
    });

    expect(semDados.statusCode).toBe(400);
    expect(semDados.body.erro).toMatch(/obrigatório/);
    expect(prioridadeInvalida.statusCode).toBe(400);
    expect(prioridadeInvalida.body.erro).toMatch(/prioridade/);
  });

  test('atualiza campos e status de um chamado', async () => {
    const criacao = await request(app).post('/api/chamados').send({
      titulo: 'Título original',
      descricao: 'Descrição original',
      solicitante: 'Ana',
    });
    const id = criacao.body.id;

    const atualizacao = await request(app).put(`/api/chamados/${id}`).send({
      titulo: 'Título atualizado',
      prioridade: 'alta',
    });
    const status = await request(app).patch(`/api/chamados/${id}/status`).send({
      status: 'em_andamento',
    });

    expect(atualizacao.statusCode).toBe(200);
    expect(atualizacao.body.titulo).toBe('Título atualizado');
    expect(atualizacao.body.descricao).toBe('Descrição original');
    expect(atualizacao.body.prioridade).toBe('alta');
    expect(status.statusCode).toBe(200);
    expect(status.body.status).toBe('em_andamento');
  });

  test('exclui um chamado e retorna 404 depois', async () => {
    const criacao = await request(app).post('/api/chamados').send({
      titulo: 'Chamado temporário',
      descricao: 'Descrição',
      solicitante: 'Ana',
    });
    const id = criacao.body.id;

    const exclusao = await request(app).delete(`/api/chamados/${id}`);
    const consulta = await request(app).get(`/api/chamados/${id}`);

    expect(exclusao.statusCode).toBe(204);
    expect(consulta.statusCode).toBe(404);
    expect(consulta.body).toEqual({ erro: 'Chamado não encontrado' });
  });
});
