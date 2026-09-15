# MiniDesk

[![CI - MiniDesk](https://github.com/jota404/Rojo-Capela-Desk/actions/workflows/ci.yml/badge.svg)](https://github.com/jota404/Rojo-Capela-Desk/actions/workflows/ci.yml)

Sistema web mínimo de chamados de suporte para um trabalho de faculdade.

## Instalação

```bash
npm install
```

## Como rodar

```bash
npm start
```

O servidor ficará disponível em `http://localhost:3000`.

## Como testar

```bash
npm test
```

## Pipeline

Em cada `push` ou pull request para a branch `main`, o GitHub Actions:

1. Instala as dependências com `npm ci`.
2. Executa os testes automatizados com `npm test`.
3. Depois dos testes, inicia a aplicação e verifica o endpoint `/api/health`.

## Deploy

O deploy é feito no Render após um `push` na branch `main` e a aprovação do workflow de CI.

1. No Render, crie um novo **Web Service** conectado ao repositório do MiniDesk.
2. Configure o comando de build como `npm ci`.
3. Configure o comando de start como `npm start`.
4. Crie o serviço e abra as configurações dele no Render.
5. Gere um **Deploy Hook** e copie a URL gerada.
6. No GitHub, abra `Settings > Secrets and variables > Actions`.
7. Crie o secret `RENDER_DEPLOY_HOOK` com a URL do Deploy Hook.

Sem esse secret, o job de deploy é automaticamente ignorado sem falhar o pipeline.

## Requisitos do trabalho

- CRUD de chamados: cadastrar, consultar, alterar status e excluir.
- Testes automatizados básicos.
- Pipeline de CI/CD executada a cada alteração no repositório.

## Stack

- Node.js e Express.
- SQLite com `better-sqlite3`.
- HTML, CSS e JavaScript puro no front-end.
- Jest e Supertest para testes.
- GitHub Actions para CI/CD.
