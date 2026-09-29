# Rojo Capela Desk 

Sistema web mínimo para registro, acompanhamento e gestão de chamados de suporte técnico, desenvolvido como parte do desafio **MiniDesk** do Curso Técnico em Informática (FEMA), aplicando práticas ágeis de Scrum, Kanban e XP.

##  Sobre o projeto

O MiniDesk permite:

* Cadastrar chamados de suporte
* Consultar chamados existentes
* Alterar o status de um chamado
* Excluir chamados

O desenvolvimento segue uma Sprint simulada de 5 encontros, com entregas incrementais, utilização de Git e GitHub, Pull Requests, testes automatizados e integração contínua.

##  Equipe

| Papel              | Nome    |
| ------------------ | ------- |
| Product Owner (PO) | Larissa |
| Scrum Master (SM)  | João    |
| Developer          | Rogério |
| Developer          | Cássio  |
| Developer          | Pedro Becker   |

##  Tecnologias

* Vite
* React
* JavaScript
* ESLint
* Git e GitHub

##  Como rodar o projeto

```bash
# 1. Clonar o repositório
git clone https://github.com/jota404/Rojo-Capela-Desk.git

# 2. Entrar na pasta do projeto
cd Rojo-Capela-Desk/rojo-capela-desk

# 3. Instalar as dependências
npm install

# 4. Iniciar o servidor backend

Abra um terminal dentro da pasta rojo-capela-desk e execute:

node server/server.js

O servidor será iniciado na porta:

http://localhost:3000

Mantenha esse terminal aberto.

# 5. Iniciar o frontend

Abra um segundo terminal e entre novamente na pasta da aplicação:

cd Rojo-Capela-Desk/rojo-capela-desk

Execute:

npm run dev

O Vite iniciará o frontend, normalmente em:

http://localhost:5173

Caso a porta 5173 esteja ocupada, o Vite poderá utilizar outra porta, como 5174.

```

##  Status Report

### O que foi entregue/codificado?

Durante o desenvolvimento, foram implementadas as principais funcionalidades do sistema, incluindo cadastro, consulta, filtragem, atualização de status e exclusão de chamados. Também foram concluídas a integração entre frontend e backend local, persistência dos dados, organização do código e configuração do fluxo de versionamento e integração contínua. O projeto encontra-se finalizado e pronto para execução.

Além do desenvolvimento das funcionalidades, a equipe continuou utilizando o GitHub para integração do código e organização das tarefas por meio do quadro Kanban.

### 2. Status no Kanban e WIP

* **Etapa atual:** Finalizado
* **Foco da Sprint:** Ajustes finais
* **Funcionalidades trabalhadas:** Verificação de funcionalidades
* **Itens em desenvolvimento:** Conforme organização do quadro Kanban da equipe
* **WIP respeitado:** Sim

O fluxo de trabalho continua seguindo as etapas:

**Backlog da Sprint → A Fazer → Em desenvolvimento → Em revisão → Em teste/CI → Concluído**

### 3. Impedimentos e Bloqueios

Durante o desenvolvimento, foram realizadas as configurações necessárias para executar o projeto localmente e continuar a implementação das funcionalidades do MVP.

Os problemas encontrados durante a configuração foram tratados pela equipe para permitir a continuidade do desenvolvimento.

##  Gestão do projeto

* **Repositório:** https://github.com/jota404/Rojo-Capela-Desk
* **Quadro Kanban:** https://canva.link/p1gpishuyz7i0rw

O trabalho é organizado utilizando o Kanban, mantendo as tarefas visíveis e acompanhando seu progresso durante a Sprint.

##  Progresso da Sprint

| Aula   | Foco                    | Status                |
| ------ | ----------------------- | --------------------- |
| Aula 1 | Planejamento & Setup    |  Concluída           |
| Aula 2 | Desenvolvimento MVP     |  Concluída           |
| Aula 3 | Integração & Adaptação  |  Concluída           |
| Aula 4 | Hardening & CI/CD       |  Concluída           |
| Aula 5 | Entrega & Retrospectiva |  Concluída           |

##  Status atual

Finalizado
