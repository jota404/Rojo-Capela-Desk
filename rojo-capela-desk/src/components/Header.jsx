import React from 'react';

export default function Header({ total = 0, pendentes = 0 }) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">Central de suporte</p>
        <h1>MiniDesk</h1>
        <p className="subtitle">Acompanhe e resolva chamados com clareza.</p>
      </div>
      <div className="summary" aria-label="Resumo dos chamados">
        <div className="summary-item">
          <strong id="total-chamados">{total}</strong>
          <span>Total</span>
        </div>
        <div className="summary-item">
          <strong id="chamados-pendentes">{pendentes}</strong>
          <span>Pendentes</span>
        </div>
      </div>
    </header>
  );
}
