const express = require('express');
const chamadosRouter = require('./routes/chamados');

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/chamados', chamadosRouter);

module.exports = app;
