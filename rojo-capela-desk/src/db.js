const Database = require('better-sqlite3');

const caminhoBanco = process.env.NODE_ENV === 'test'
	? ':memory:'
	: (process.env.DB_PATH || 'minidesk.db');
const db = new Database(caminhoBanco);

db.pragma('journal_mode = WAL');

db.exec(`
	CREATE TABLE IF NOT EXISTS chamados (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		titulo TEXT NOT NULL,
		descricao TEXT NOT NULL,
		solicitante TEXT NOT NULL,
		prioridade TEXT NOT NULL DEFAULT 'media',
		status TEXT NOT NULL DEFAULT 'aberto',
		criado_em TEXT NOT NULL,
		atualizado_em TEXT NOT NULL
	)
`);

module.exports = db;
