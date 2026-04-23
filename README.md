# 🚀 LoginProject API - Backend

Esta é a API REST que gerencia a autenticação, persistência de dados e integração com provedores de OAuth2.

## 🛠️ Tecnologias e Dependências

- **Runtime:** Node.js (v22+)
- **Framework:** Express
- **ORM:** Sequelize (PostgreSQL)
- **Segurança:** - `bcryptjs`: Hash de senhas.
  - `jsonwebtoken` (JWT): Emissão e validação de tokens.
  - `google-auth-library`: Validação de tokens Google.
  - `cors`: Liberação de acessos para o Front-end.

## 📋 Pré-requisitos

- **Docker** e **Docker Compose** (para o banco de dados).
- **Node.js** instalado localmente.
