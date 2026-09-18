const express = require('express');
const path = require('path');
const chamadosRouter = require('./routes/chamados');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/chamados', chamadosRouter);

module.exports = app;
