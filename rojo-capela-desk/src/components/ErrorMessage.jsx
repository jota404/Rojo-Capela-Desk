import React from 'react';

export default function ErrorMessage({ mensagem }) {
  if (!mensagem) return null;

  return (
    <div id="mensagem-erro" className="error-message" role="alert">
      {mensagem}
    </div>
  );
}
