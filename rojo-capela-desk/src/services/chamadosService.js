export const NOMES_STATUS = {
  aberto: 'Aberto',
  em_andamento: 'Em andamento',
  resolvido: 'Resolvido',
};

export const NOMES_PRIORIDADE = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};

export function formatarData(data) {
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

export async function buscarChamados(filtros = {}) {
  const parametros = new URLSearchParams();
  if (filtros.status) parametros.set('status', filtros.status);
  if (filtros.prioridade) parametros.set('prioridade', filtros.prioridade);

  const query = parametros.toString();
  return requisicaoApi(`/api/chamados${query ? `?${query}` : ''}`);
}

export async function buscarResumo() {
  return requisicaoApi('/api/chamados');
}

export async function criarChamado(dados) {
  return requisicaoApi('/api/chamados', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export async function atualizarStatusChamado(id, status) {
  return requisicaoApi(`/api/chamados/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function excluirChamado(id) {
  return requisicaoApi(`/api/chamados/${id}`, {
    method: 'DELETE',
  });
}
