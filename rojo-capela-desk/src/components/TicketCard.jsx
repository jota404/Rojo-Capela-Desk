import React from 'react';
import { NOMES_STATUS, NOMES_PRIORIDADE, formatarData } from '../services/chamadosService';

export default function TicketCard({ chamado, onAtualizarStatus, onExcluir }) {
  return (
    <article className="ticket-card">
      <div className="ticket-top">
        <h3 className="ticket-title">{chamado.titulo}</h3>
        <span className={`status-badge status-${chamado.status}`}>
          {NOMES_STATUS[chamado.status] || chamado.status}
        </span>
      </div>
      <p className="ticket-description">{chamado.descricao}</p>
      <div className="ticket-meta">
        <span>Prioridade: {NOMES_PRIORIDADE[chamado.prioridade] || chamado.prioridade}</span>
        <span>Solicitante: {chamado.solicitante}</span>
        <span>Criado em: {formatarData(chamado.criado_em)}</span>
      </div>
      <div className="ticket-controls">
        <label>
          Status
          <select
            className="status-control"
            value={chamado.status}
            onChange={(e) => onAtualizarStatus(chamado.id, e.target.value)}
          >
            {Object.entries(NOMES_STATUS).map(([valor, nome]) => (
              <option key={valor} value={valor}>
                {nome}
              </option>
            ))}
          </select>
        </label>
        <button
          className="button-delete"
          type="button"
          onClick={() => onExcluir(chamado.id)}
        >
          Excluir
        </button>
      </div>
    </article>
  );
}
