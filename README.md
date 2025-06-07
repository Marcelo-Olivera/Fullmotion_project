# Fullmotion - Plataforma de Fisioterapia Online

![Status do Projeto](https://img.shields.io/badge/status-Em%20Desenvolvimento-blue)
![Tecnologias Frontend](https://img.shields.io/badge/frontend-ReactJS%20%7C%20MUI-blueviolet)
![Tecnologias Backend](https://img.shields.io/badge/backend-Node.js%20%7C%20NestJS%20%7C%20PostgreSQL-green)
![Tipo de Projeto](https://img.shields.io/badge/tipo-Fullstack%20Web-red)

---

## Sobre o Projeto

A **Fullmotion** é uma plataforma inovadora desenvolvida para otimizar a gestão e interação entre fisioterapeutas e seus pacientes. Nosso objetivo é oferecer uma solução digital completa para agendamento de consultas, gestão de conteúdo (vídeos de exercícios), e acompanhamento personalizado, visando melhorar a experiência de ambos os lados e a eficácia dos tratamentos fisioterapêuticos.

Este projeto é uma aplicação web fullstack, com planos futuros para expansão mobile.

## Funcionalidades Principais

A plataforma é dividida em módulos que atendem a diferentes perfis de usuário:

### Módulos Comuns:

* **Autenticação e Autorização:** Sistema de login seguro com JWT, suportando perfis de **Admin**, **Fisioterapeuta** e **Paciente**.
* **Gerenciamento de Usuários (Admin):** Administradores podem listar, criar e deletar usuários de qualquer perfil.
* **Redefinição de Senha:** Fluxo completo para recuperação de acesso via e-mail.

### Módulos para Fisioterapeutas & Admins:

* **Gestão de Vídeos:** Upload (apenas Admin), listagem completa, edição de metadados e status de acesso (privado, público, pacientes específicos).
* **Liberação de Conteúdo:** Fisioterapeutas podem liberar vídeos de exercícios para pacientes específicos.
* **Gerenciamento de Agendamentos:** Módulo de backend para registro e status de consultas (pronto para integração com automação externa como WhatsApp).

### Módulos para Pacientes:

* **Agendamento de Avaliações:** Página para agendamento da primeira avaliação (com informações pessoais).
* **Visualização de Vídeos:** Pacientes podem acessar e reproduzir apenas os vídeos de exercícios que foram liberados para eles.

## Tecnologias Utilizadas

Este projeto é construído com um stack de tecnologias modernas e robustas:

* **Frontend:**
    * **ReactJS:** Biblioteca JavaScript para construção da interface de usuário.
    * **TypeScript:** Superconjunto tipado do JavaScript para maior segurança e escalabilidade.
    * **Material-UI (MUI):** Biblioteca de componentes React para um design elegante e responsivo.
    * **React Router DOM:** Para gerenciamento de rotas e navegação.
    * **Axios:** Cliente HTTP para requisições à API.
* **Backend:**
    * **Node.js:** Ambiente de execução JavaScript no servidor.
    * **NestJS:** Framework progressivo para Node.js, para construir APIs eficientes e escaláveis.
    * **PostgreSQL:** Banco de dados relacional robusto e de alto desempenho.
    * **TypeORM:** ORM (Object-Relational Mapper) para interação com o PostgreSQL.
    * **JSON Web Tokens (JWT):** Para autenticação segura.
    * **Multer:** Middleware para tratamento de upload de arquivos (vídeos).
    * **Nodemailer & @nestjs-modules/mailer:** Para envio de e-mails transacionais (ex: redefinição de senha).
    * **bcryptjs:** Para hash seguro de senhas.
* **Containerização:**
    * **Docker:** Para gerenciar o ambiente de banco de dados (PostgreSQL) e facilitar o deploy.

