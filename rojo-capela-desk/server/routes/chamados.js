const express = require('express');
const db = require('../db');

const router = express.Router();

const prioridadesValidas = ['baixa', 'media', 'alta'];
const statusValidos = ['aberto', 'em_andamento', 'resolvido'];

const buscarPorId = db.prepare('SELECT * FROM chamados WHERE id = ?');
const inserirChamado = db.prepare(`
	INSERT INTO chamados (
		titulo, descricao, solicitante, prioridade, status, criado_em, atualizado_em
	) VALUES (@titulo, @descricao, @solicitante, @prioridade, @status, @criadoEm, @atualizadoEm)
`);
const atualizarChamado = db.prepare(`
	UPDATE chamados
	SET titulo = COALESCE(@titulo, titulo),
			descricao = COALESCE(@descricao, descricao),
			solicitante = COALESCE(@solicitante, solicitante),
			prioridade = COALESCE(@prioridade, prioridade),
			status = COALESCE(@status, status),
			atualizado_em = @atualizadoEm
	WHERE id = @id
`);
const atualizarStatus = db.prepare(`
	UPDATE chamados
	SET status = @status, atualizado_em = @atualizadoEm
	WHERE id = @id
`);
const excluirChamado = db.prepare('DELETE FROM chamados WHERE id = ?');

function textoValido(valor) {
	return typeof valor === 'string' && valor.trim() !== '';
}

function validarCamposObrigatorios(dados) {
	const camposObrigatorios = ['titulo', 'descricao', 'solicitante'];
	const campoInvalido = camposObrigatorios.find((campo) => !textoValido(dados[campo]));

	if (campoInvalido) {
		return `O campo ${campoInvalido} é obrigatório e não pode estar vazio`;
	}

	return null;
}

function validarOpcoes(dados) {
	if (dados.prioridade !== undefined && !prioridadesValidas.includes(dados.prioridade)) {
		return 'A prioridade deve ser baixa, media ou alta';
	}

	if (dados.status !== undefined && !statusValidos.includes(dados.status)) {
		return 'O status deve ser aberto, em_andamento ou resolvido';
	}

	return null;
}

function obterId(valor) {
	const id = Number(valor);
	return Number.isInteger(id) && id > 0 ? id : null;
}

router.get('/', (req, res) => {
	const { status, prioridade } = req.query;
	const chamados = db.prepare(`
		SELECT * FROM chamados
		WHERE (@status IS NULL OR status = @status)
			AND (@prioridade IS NULL OR prioridade = @prioridade)
		ORDER BY id DESC
	`).all({
		status: status || null,
		prioridade: prioridade || null,
	});

	res.json(chamados);
});

router.get('/:id', (req, res) => {
	const id = obterId(req.params.id);
	const chamado = id ? buscarPorId.get(id) : undefined;

	if (!chamado) {
		return res.status(404).json({ erro: 'Chamado não encontrado' });
	}

	return res.json(chamado);
});

router.post('/', (req, res) => {
	const dados = req.body || {};
	const erroObrigatorio = validarCamposObrigatorios(dados);
	const erroOpcao = validarOpcoes(dados);

	if (erroObrigatorio || erroOpcao) {
		return res.status(400).json({ erro: erroObrigatorio || erroOpcao });
	}

	const agora = new Date().toISOString();
	const resultado = inserirChamado.run({
		titulo: dados.titulo.trim(),
		descricao: dados.descricao.trim(),
		solicitante: dados.solicitante.trim(),
		prioridade: dados.prioridade || 'media',
		status: dados.status || 'aberto',
		criadoEm: agora,
		atualizadoEm: agora,
	});

	return res.status(201).json(buscarPorId.get(resultado.lastInsertRowid));
});

router.patch('/:id/status', (req, res) => {
	const id = obterId(req.params.id);
	const { status } = req.body || {};

	if (!statusValidos.includes(status)) {
		return res.status(400).json({ erro: 'O status deve ser aberto, em_andamento ou resolvido' });
	}

	if (!id || !buscarPorId.get(id)) {
		return res.status(404).json({ erro: 'Chamado não encontrado' });
	}

	atualizarStatus.run({ id, status, atualizadoEm: new Date().toISOString() });
	return res.json(buscarPorId.get(id));
});

router.put('/:id', (req, res) => {
	const id = obterId(req.params.id);
	const dados = req.body || {};
	const camposAtualizaveis = ['titulo', 'descricao', 'solicitante', 'prioridade', 'status'];
	const possuiCampoAtualizavel = camposAtualizaveis.some((campo) => dados[campo] !== undefined);
	const erroObrigatorio = camposAtualizaveis
		.filter((campo) => ['titulo', 'descricao', 'solicitante'].includes(campo))
		.find((campo) => dados[campo] !== undefined && !textoValido(dados[campo]));
	const erroOpcao = validarOpcoes(dados);

	if (!id || !buscarPorId.get(id)) {
		return res.status(404).json({ erro: 'Chamado não encontrado' });
	}

	if (!possuiCampoAtualizavel) {
		return res.status(400).json({ erro: 'Informe ao menos um campo para atualizar' });
	}

	if (erroObrigatorio) {
		return res.status(400).json({ erro: `O campo ${erroObrigatorio} é obrigatório e não pode estar vazio` });
	}

	if (erroOpcao) {
		return res.status(400).json({ erro: erroOpcao });
	}

	atualizarChamado.run({
		id,
		titulo: dados.titulo === undefined ? null : dados.titulo.trim(),
		descricao: dados.descricao === undefined ? null : dados.descricao.trim(),
		solicitante: dados.solicitante === undefined ? null : dados.solicitante.trim(),
		prioridade: dados.prioridade === undefined ? null : dados.prioridade,
		status: dados.status === undefined ? null : dados.status,
		atualizadoEm: new Date().toISOString(),
	});

	return res.json(buscarPorId.get(id));
});

router.delete('/:id', (req, res) => {
	const id = obterId(req.params.id);

	if (!id || !buscarPorId.get(id)) {
		return res.status(404).json({ erro: 'Chamado não encontrado' });
	}

	excluirChamado.run(id);
	return res.status(204).send();
});

module.exports = router;
