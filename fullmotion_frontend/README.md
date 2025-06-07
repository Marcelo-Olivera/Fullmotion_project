# Fullmotion - Frontend

![Tecnologias Frontend](https://img.shields.io/badge/frontend-ReactJS%20%7C%20MUI-blueviolet)
![Status do Projeto](https://img.shields.io/badge/status-Em%20Desenvolvimento-blue)

---

## Sobre

Este é o projeto de frontend da plataforma **Fullmotion**, construído com ReactJS. Ele oferece a interface de usuário interativa que permite a pacientes, fisioterapeutas e administradores interagirem com o sistema.

## Funcionalidades da Interface

* **Páginas Públicas:**
    * Site oficial da empresa.
    * Página de Login.
    * Páginas de "Esqueceu a Senha" e "Redefinir Senha".
* **Dashboard por Perfil:**
    * **Paciente:** visualização de "Meus Vídeos".
    * **Fisioterapeuta:** visualização de todos os vídeos.
    * **Admin:** Acesso a todas as funcionalidades do fisioterapeuta, além de gerenciamento de usuários e upload de vídeos.
    
* **Gestão de Conteúdo de Vídeos:** Interface para upload, listagem, edição de permissões e deleção de vídeos.
* **Design Responsivo:** Otimizado para telas de iPhone e iPad, garantindo uma boa experiência em dispositivos móveis e tablets.

## Tecnologias Utilizadas

* **ReactJS:** Biblioteca JavaScript para construção de interfaces de usuário.
* **TypeScript:** Para tipagem estática e maior segurança no desenvolvimento.
* **Material-UI (MUI):** Biblioteca de componentes para um design moderno e responsivo.
* **React Router DOM:** Para gerenciamento de rotas e navegação na aplicação.
* **Axios:** Cliente HTTP para comunicação com a API de backend.
* **`jwt-decode`:** Para decodificar JWTs no cliente e extrair informações do usuário.
* **CSS Modules:** Para encapsulamento de estilos específicos de componentes.

## Configuração do Ambiente Local

### Pré-requisitos

Certifique-se de ter o Node.js (versão 18.x ou superior) e o npm (ou yarn) instalados.

### Passos de Configuração

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU_USUARIO/fullmotion.git](https://github.com/SEU_USUARIO/fullmotion.git)
    cd fullmotion/frontend
    ```
    (Ajuste o caminho se seu repositório não for `fullmotion` ou se o frontend não estiver em `frontend/`)

2.  **Instalar Dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Iniciar o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    # ou
    yarn start
    ```
    O aplicativo estará disponível em `http://localhost:5173` (ou outra porta, verifique o console).

## Estrutura do Projeto

fullmotion_frontend/  
├── public/                       # Arquivos estáticos  
├── src/  
│   ├── assets/                   # Imagens, ícones, etc.  
│   ├── components/               # Componentes reutilizáveis (Header, Footer, PrivateRoute, AdminRoute, AuthRoleRoute)  
│   ├── context/                  # Context API (AuthContext para autenticação)  
│   │   └── AuthContext.tsx   
│   ├── pages/                    # Páginas da aplicação  
│   │   ├── AgendarAvaliacao/     # Página de agendamento de primeira avaliação  
│   │   ├── Dashboard/            # Dashboard principal por perfil (paciente, fisioterapeuta, admin)  
│   │   ├── EsqueceuSenha/        # Página para solicitar redefinição de senha  
│   │   ├── Login/                # Página de login  
│   │   ├── PatientVideos/        # Página para pacientes visualizarem seus vídeos  
│   │   ├── ResetPassword/        # Página para redefinir senha com token  
│   │   ├── UploadVideo/          # Página para Admin fazer upload de vídeos  
│   │   ├── UserManagement/       # Página para Admin gerenciar usuários  
│   │   ├── VideoManagement/      # Página para Fisioterapeuta/Admin gerenciar vídeos  
│   │   └── ...  
│   ├── App.tsx                   # Componente principal e rotas  
│   ├── index.css                 # Estilos globais  
│   └── main.tsx                  # Ponto de entrada do React  
├── package.json  
└── tsconfig.json  