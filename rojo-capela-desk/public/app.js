const formChamado = document.querySelector('#form-chamado');
const listaChamados = document.querySelector('#lista-chamados');
const filtroStatus = document.querySelector('#filtro-status');
const filtroPrioridade = document.querySelector('#filtro-prioridade');
const mensagemErro = document.querySelector('#mensagem-erro');
const totalChamados = document.querySelector('#total-chamados');
const chamadosPendentes = document.querySelector('#chamados-pendentes');

const nomesStatus = {
	aberto: 'Aberto',
	em_andamento: 'Em andamento',
	resolvido: 'Resolvido',
};

const nomesPrioridade = {
	baixa: 'Baixa',
	media: 'Média',
	alta: 'Alta',
};

function mostrarErro(mensagem) {
	mensagemErro.textContent = mensagem;
	mensagemErro.hidden = false;
}

function limparErro() {
	mensagemErro.textContent = '';
	mensagemErro.hidden = true;
}

function escaparHtml(valor) {
	return String(valor)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#039;');
}

function formatarData(data) {
	return new Intl.DateTimeFormat('pt-BR', {
		dateStyle: 'short',
		timeStyle: 'short',
	}).format(new Date(data));
}

async function requisicaoApi(url, opcoes = {}) {
	const resposta = await fetch(url, {
		headers: { 'Content-Type': 'application/json' },
		...opcoes,
	});

	if (!resposta.ok) {
		const dados = await resposta.json().catch(() => ({}));
		throw new Error(dados.erro || 'Não foi possível concluir a operação.');
	}

	return resposta.status === 204 ? null : resposta.json();
}

function opcoesStatus(statusAtual) {
	return Object.entries(nomesStatus)
		.map(([valor, nome]) => `
			<option value="${valor}" ${valor === statusAtual ? 'selected' : ''}>${nome}</option>
		`)
		.join('');
}

function renderizarChamados(chamados, resumo) {
	totalChamados.textContent = resumo.length;
	chamadosPendentes.textContent = resumo.filter(({ status }) => status !== 'resolvido').length;

	if (chamados.length === 0) {
		listaChamados.innerHTML = '<p class="empty-state">Nenhum chamado por aqui ainda.</p>';
		return;
	}

	listaChamados.innerHTML = chamados.map((chamado) => `
		<article class="ticket-card">
			<div class="ticket-top">
				<h3 class="ticket-title">${escaparHtml(chamado.titulo)}</h3>
				<span class="status-badge status-${escaparHtml(chamado.status)}">${nomesStatus[chamado.status]}</span>
			</div>
			<p class="ticket-description">${escaparHtml(chamado.descricao)}</p>
			<div class="ticket-meta">
				<span>Prioridade: ${nomesPrioridade[chamado.prioridade]}</span>
				<span>Solicitante: ${escaparHtml(chamado.solicitante)}</span>
				<span>Criado em: ${formatarData(chamado.criado_em)}</span>
			</div>
			<div class="ticket-controls">
				<label>
					Status
					<select class="status-control" data-id="${chamado.id}">
						${opcoesStatus(chamado.status)}
					</select>
				</label>
				<button class="button-delete" type="button" data-id="${chamado.id}">Excluir</button>
			</div>
		</article>
	`).join('');
}

async function carregarChamados() {
	const parametros = new URLSearchParams();

	if (filtroStatus.value) parametros.set('status', filtroStatus.value);
	if (filtroPrioridade.value) parametros.set('prioridade', filtroPrioridade.value);

	try {
		const [chamados, resumo] = await Promise.all([
			requisicaoApi(`/api/chamados?${parametros.toString()}`),
			requisicaoApi('/api/chamados'),
		]);
		renderizarChamados(chamados, resumo);
	} catch (erro) {
		mostrarErro(erro.message);
	}
}

formChamado.addEventListener('submit', async (evento) => {
	evento.preventDefault();
	limparErro();

	const dados = Object.fromEntries(new FormData(formChamado));

	try {
		await requisicaoApi('/api/chamados', {
			method: 'POST',
			body: JSON.stringify(dados),
		});
		formChamado.reset();
		await carregarChamados();
	} catch (erro) {
		mostrarErro(erro.message);
	}
});

filtroStatus.addEventListener('change', carregarChamados);
filtroPrioridade.addEventListener('change', carregarChamados);

listaChamados.addEventListener('change', async (evento) => {
	if (!evento.target.matches('.status-control')) return;

	limparErro();

	try {
		await requisicaoApi(`/api/chamados/${evento.target.dataset.id}/status`, {
			method: 'PATCH',
			body: JSON.stringify({ status: evento.target.value }),
		});
		await carregarChamados();
	} catch (erro) {
		mostrarErro(erro.message);
	}
});

listaChamados.addEventListener('click', async (evento) => {
	const botaoExcluir = evento.target.closest('.button-delete');
	if (!botaoExcluir) return;

	if (!window.confirm('Deseja excluir este chamado?')) return;

	limparErro();

	try {
		await requisicaoApi(`/api/chamados/${botaoExcluir.dataset.id}`, { method: 'DELETE' });
		await carregarChamados();
	} catch (erro) {
		mostrarErro(erro.message);
	}
});

carregarChamados();
