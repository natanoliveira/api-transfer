# API de Transferencia (Backend)

Backend basico para uma plataforma de transferencias entre usuarios comuns e lojistas.

## O que este projeto oferece

- API REST com NestJS
- Documentacao Swagger em `/docs`
- Validacoes de payload com class-validator
- Regras de negocio para transferencia
- Integracao com autorizador externo (mock)
- Notificacao pos-transferencia (mock)
- Prisma como ORM para PostgreSQL
- Docker Compose para banco local

## Endpoints principais

- POST /users
- GET /users?page=1&limit=10
- GET /wallets/:userId/balance
- GET /wallets?page=1&limit=10
- POST /wallets/:userId/transactions
- POST /transfers
- GET /transfers?page=1&limit=10
- GET /transfers/users/:userId
- GET /transfers/users/:userId/sent
- GET /transfers/users/:userId/received

## Stack

- Node.js + NestJS
- PostgreSQL
- Prisma ORM
- Docker / Docker Compose
