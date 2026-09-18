import React, { useState } from 'react';

export default function TicketForm({ onCriarChamado }) {
  const [titulo, setTitulo] = useState('');
  const [solicitante, setSolicitante] = useState('');
  const [prioridade, setPrioridade] = useState('media');
  const [descricao, setDescricao] = useState('');
  const [submetendo, setSubmetendo] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmetendo(true);
    try {
      await onCriarChamado({ titulo, solicitante, prioridade, descricao });
      setTitulo('');
      setSolicitante('');
      setPrioridade('media');
      setDescricao('');
    } finally {
      setSubmetendo(false);
    }
  }

  return (
    <section className="panel" aria-labelledby="novo-chamado-titulo">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Novo registro</p>
          <h2 id="novo-chamado-titulo">Abrir chamado</h2>
        </div>
        <span className="section-mark">+</span>
      </div>
      <form id="form-chamado" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Título
            <input
              name="titulo"
              type="text"
              placeholder="Ex.: Acesso ao sistema"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </label>
          <label>
            Solicitante
            <input
              name="solicitante"
              type="text"
              placeholder="Nome da pessoa"
              value={solicitante}
              onChange={(e) => setSolicitante(e.target.value)}
              required
            />
          </label>
          <label>
            Prioridade
            <select
              name="prioridade"
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </label>
          <label className="field-wide">
            Descrição
            <textarea
              name="descricao"
              rows="4"
              placeholder="Descreva o que aconteceu"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            ></textarea>
          </label>
        </div>
        <div className="form-actions">
          <button className="button-primary" type="submit" disabled={submetendo}>
            {submetendo ? 'Enviando...' : 'Abrir chamado'}
          </button>
        </div>
      </form>
    </section>
  );
}
