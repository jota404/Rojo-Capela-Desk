import React from 'react';

export default function TicketFilters({ status, prioridade, onStatusChange, onPrioridadeChange }) {
  return (
    <div className="filters" aria-label="Filtros de chamados">
      <label>
        Status
        <select
          id="filtro-status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="aberto">Aberto</option>
          <option value="em_andamento">Em andamento</option>
          <option value="resolvido">Resolvido</option>
        </select>
      </label>
      <label>
        Prioridade
        <select
          id="filtro-prioridade"
          value={prioridade}
          onChange={(e) => onPrioridadeChange(e.target.value)}
        >
          <option value="">Todas</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
      </label>
    </div>
  );
}
