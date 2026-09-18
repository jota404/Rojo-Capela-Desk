import React from 'react';
import TicketFilters from './TicketFilters';
import TicketCard from './TicketCard';

export default function TicketList({
  chamados = [],
  filtroStatus,
  filtroPrioridade,
  onStatusChange,
  onPrioridadeChange,
  onAtualizarStatus,
  onExcluir,
}) {
  return (
    <section className="ticket-section" aria-labelledby="lista-titulo">
      <div className="list-header">
        <div>
          <p className="eyebrow">Acompanhamento</p>
          <h2 id="lista-titulo">Chamados</h2>
        </div>
        <TicketFilters
          status={filtroStatus}
          prioridade={filtroPrioridade}
          onStatusChange={onStatusChange}
          onPrioridadeChange={onPrioridadeChange}
        />
      </div>
      <div id="lista-chamados" className="tickets-list" aria-live="polite">
        {chamados.length === 0 ? (
          <p className="empty-state">Nenhum chamado por aqui ainda.</p>
        ) : (
          chamados.map((chamado) => (
            <TicketCard
              key={chamado.id}
              chamado={chamado}
              onAtualizarStatus={onAtualizarStatus}
              onExcluir={onExcluir}
            />
          ))
        )}
      </div>
    </section>
  );
}
