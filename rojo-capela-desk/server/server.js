const app = require('./app');

const porta = process.env.PORT || 3000;

app.listen(porta, () => {
  console.log(`MiniDesk rodando na porta ${porta}`);
});
