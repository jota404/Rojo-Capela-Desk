import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ErrorMessage from './components/ErrorMessage';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import {
  buscarChamados,
  buscarResumo,
  criarChamado,
  atualizarStatusChamado,
  excluirChamado,
} from './services/chamadosService';

export default function App() {
  const [chamados, setChamados] = useState([]);
  const [total, setTotal] = useState(0);
  const [pendentes, setPendentes] = useState(0);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroPrioridade, setFiltroPrioridade] = useState('');
  const [erro, setErro] = useState('');

  const carregarChamados = useCallback(async () => {
    try {
      const [lista, resumo] = await Promise.all([
        buscarChamados({ status: filtroStatus, prioridade: filtroPrioridade }),
        buscarResumo(),
      ]);
      setChamados(lista);
      setTotal(resumo.length);
      setPendentes(resumo.filter((c) => c.status !== 'resolvido').length);
      setErro('');
    } catch (err) {
      setErro(err.message || 'Erro ao carregar chamados');
    }
  }, [filtroStatus, filtroPrioridade]);

  useEffect(() => {
    carregarChamados();
  }, [carregarChamados]);

  async function handleCriarChamado(dados) {
    setErro('');
    try {
      await criarChamado(dados);
      await carregarChamados();
    } catch (err) {
      setErro(err.message);
      throw err;
    }
  }

  async function handleAtualizarStatus(id, status) {
    setErro('');
    try {
      await atualizarStatusChamado(id, status);
      await carregarChamados();
    } catch (err) {
      setErro(err.message);
    }
  }

  async function handleExcluirChamado(id) {
    if (!window.confirm('Deseja excluir este chamado?')) return;

    setErro('');
    try {
      await excluirChamado(id);
      await carregarChamados();
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <main className="container">
      <Header total={total} pendentes={pendentes} />
      <ErrorMessage mensagem={erro} />
      <TicketForm onCriarChamado={handleCriarChamado} />
      <TicketList
        chamados={chamados}
        filtroStatus={filtroStatus}
        filtroPrioridade={filtroPrioridade}
        onStatusChange={setFiltroStatus}
        onPrioridadeChange={setFiltroPrioridade}
        onAtualizarStatus={handleAtualizarStatus}
        onExcluir={handleExcluirChamado}
      />
    </main>
  );
}
