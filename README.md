# API de Transferencia (Backend)

Backend basico para uma plataforma de transferencias entre usuarios comuns e lojistas.

## O que este projeto oferece

- API REST com NestJS
- Validacoes de payload com class-validator
- Regras de negocio para transferencia
- Integracao com autorizador externo (mock)
- Notificacao pos-transferencia (mock)
- Prisma como ORM para PostgreSQL
- Docker Compose para banco local

## Endpoints principais

- POST /users
- GET /wallets/:userId/balance
- POST /transfer

## Stack

- Node.js + NestJS
- PostgreSQL
- Prisma ORM
- Docker / Docker Compose
