# Fullmotion - Backend

![Tecnologias Backend](https://img.shields.io/badge/backend-Node.js%20%7C%20NestJS%20%7C%20PostgreSQL-green)
![Status do Projeto](https://img.shields.io/badge/status-Em%20Desenvolvimento-blue)

---

## Sobre

Este é o projeto de backend da plataforma **Fullmotion**, construído com Node.js e o framework NestJS. Ele é responsável por toda a lógica de negócio, autenticação, gerenciamento de dados e comunicação com o banco de dados PostgreSQL.

## Funcionalidades da API

A API RESTful oferece endpoints para:

* **Autenticação:** Registro, Login (JWT), solicitação e redefinição de senha.
* **Gerenciamento de Usuários:** CRUD completo para administradores (listar, criar, deletar usuários de qualquer role).
* **Gestão de Vídeos:**
    * Upload de arquivos de vídeo (apenas Admin).
    * Listagem de todos os vídeos (Admin e Fisioterapeuta).
    * Visualização de vídeos liberados (Paciente).
    * Atualização de metadados e status de acesso (Privado, Público para Pacientes, Pacientes Específicos).
    * Deleção de vídeos (apenas Admin).
* **Agendamentos:** Criação, listagem e atualização de agendamentos (pronto para integração via automação externa).

## Tecnologias Utilizadas

* **Node.js**
* **NestJS:** Framework para arquitetura modular e escalável.
* **TypeScript:** Para tipagem estática e robustez.
* **PostgreSQL:** Banco de dados relacional.
* **TypeORM:** ORM para interação com o banco de dados.
* **JWT (JSON Web Tokens):** Para autenticação e autorização stateless.
* **Multer:** Middleware para lidar com `multipart/form-data` (upload de arquivos).
* **Nodemailer & @nestjs-modules/mailer:** Para envio de e-mails (redefinição de senha).
* **bcryptjs:** Para hash seguro de senhas.
* **Docker:** Para containerização do banco de dados em ambiente de desenvolvimento.

## Configuração do Ambiente Local

### Pré-requisitos

Certifique-se de ter instalado:

* Node.js (versão 18.x ou superior)
* npm (gerenciador de pacotes do Node.js)
* Docker e Docker Compose (para o PostgreSQL)

### Passos de Configuração

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU_USUARIO/fullmotion.git](https://github.com/SEU_USUARIO/fullmotion.git)
    cd fullmotion/backend
    ```
    (Ajuste o caminho se seu repositório não for `fullmotion` ou se o backend não estiver em `backend/`)

2.  **Variáveis de Ambiente:**
    * Crie um arquivo `.env` na raiz da pasta `backend/`.
    * Copie o conteúdo de `backend/.env.example` para `backend/.env`.
    * **Preencha as variáveis** com seus dados:

        ```env
        # Configurações do Banco de Dados PostgreSQL (Docker)
        DB_HOST=localhost
        DB_PORT=5433                # Porta mapeada no Docker Compose
        DB_USERNAME=fullmotion_usr
        DB_PASSWORD=sua_senha_correta_do_postgres # IMPORTANTE: use a mesma senha que usar no docker run!
        DB_DATABASE=fullmotion_db

        # Chave Secreta JWT (deve ser uma string longa e aleatória)
        JWT_SECRET=sua_chave_secreta_muito_longa_e_aleatoria_para_o_jwt_fullmotion_aqui

        # Configurações de E-mail SMTP (Gmail, SendGrid, etc.)
        MAIL_HOST=smtp.gmail.com        # Ex: smtp.gmail.com (Gmail), smtp.sendgrid.net (SendGrid)
        MAIL_PORT=587                     # Ex: 587 (STARTTLS), 465 (SSL/TLS)
        MAIL_USER=seu_email@gmail.com   # Seu e-mail ou API Key (ex: apikey para SendGrid)
        MAIL_PASS=sua_senha_de_app_ou_api_key # Sua senha de app do Google ou API Key do serviço
        MAIL_FROM=no-reply@fullmotion.com # E-mail remetente

        # URL do Frontend (para links de redefinição de senha, etc.)
        BASE_FRONTEND_URL=http://localhost:5173 # AJUSTE PARA A PORTA REAL DO SEU FRONTEND (ex: 5173 para Vite)
        ```

3.  **Iniciar o Banco de Dados PostgreSQL com Docker:**
    * Se você não tem um contêiner PostgreSQL rodando, inicie-o:
        ```bash
        docker run --name fullmotion-postgres \
                   -e POSTGRES_USER=fullmotion_usr \
                   -e POSTGRES_PASSWORD=sua_senha_correta_do_postgres \
                   -e POSTGRES_DB=fullmotion_db \
                   -p 5433:5432 \
                   -d postgres
        ```
    * **IMPORTANTE:** Certifique-se de que `sua_senha_correta_do_postgres` seja a **mesma** que você colocou no `.env`.
    * Se o contêiner já existir e você precisar resetá-lo ou mudar a senha:
        ```bash
        docker stop fullmotion-postgres
        docker rm -f fullmotion-postgres
        # Execute o comando `docker run` acima novamente
        ```
    * Para garantir que todos os volumes e caches antigos sejam limpos (usar com cautela, pois remove TUDO):
        ```bash
        docker system prune -a --volumes
        # Depois execute o comando `docker run` para recriar o DB
        ```

4.  **Instalar Dependências do Backend:**
    ```bash
    npm install
    ```

5.  **Iniciar o Servidor Backend:**
    ```bash
    npm run start:dev
    ```
    O servidor estará disponível em `http://localhost:3000`.

## Teste da API (Postman / Insomnia)

Utilize uma ferramenta como Postman ou Insomnia para testar os endpoints da API.

* **Login:** `POST http://localhost:3000/api/auth/login`
* **Upload de Vídeo:** `POST http://localhost:3000/api/videos/upload` (multipart/form-data)
* **Listar Vídeos:** `GET http://localhost:3000/api/videos`
* **Solicitar Redefinição de Senha:** `POST http://localhost:3000/api/auth/forgot-password`
* **Redefinir Senha:** `POST http://localhost:3000/api/auth/reset-password`
* ... e outros endpoints para gerenciamento de usuários e agendamentos.

## Estrutura do Projeto

fullmotion_backend/  
├── src/  
│   ├── auth/                     # Módulo de Autenticação (Login, JWT, Guards, Redefinição)  
│   ├── users/                    # Módulo de Usuários (CRUD, Entidade User)  
│   │   ├── dto/                  # DTOs para usuários  
│   │   ├── user.entity.ts        # Definição da entidade User  
│   │   └── ...  
│   ├── appointments/             # Módulo de Agendamentos (se for expandir)  
│   ├── videos/                   # Módulo de Vídeos (Upload, Gestão)  
│   │   ├── dto/                  # DTOs para vídeos  
│   │   ├── video.entity.ts       # Definição da entidade Video  
│   │   └── ...  
│   ├── mail-templates/           # Templates de e-mail (Pug)  
│   │   └── reset-password.pug  
│   ├── app.module.ts             # Módulo principal da aplicação  
│   ├── main.ts                   # Ponto de entrada da aplicação  
│   └── ...  
├── uploads/                      # Pasta para arquivos de vídeo enviados localmente  
├── .env.example                  # Exemplo de variáveis de ambiente  
├── .env                          # Variáveis de ambiente locais (não versionado)  
├── package.json  
└── tsconfig.json  

