# API de Transferência

## Visao geral
Este projeto implementa uma API REST para transferências entre usuários comuns e lojistas, utilizando NestJS e Prisma. A solucao organiza domínio, casos de uso e infraestrutura em modulos, com separacao clara de responsabilidades.

## Funcionalidades
- Criacao de usuários com validacao de dados.
- Consulta de saldo por usuário.
- Listagem paginada de usuários, carteiras e transferências.
- Extrato de transferências enviadas e recebidas com nome do pagador/recebedor.
- Criacao de transferências com regras de negocio (saldo, perfil e autorizacao).
- Notificação pos-transferência via HTTP (mock externo), com auditoria persistida via RabbitMQ.
- Cache de saldo com TTL configurável.
- Documentacao Swagger em `/docs`.

## Arquitetura
- Domínio: entidades, enums, políticas e erros em `src/domain`.
- Aplicação: casos de uso em `src/modules/**/services`.
- Infraestrutura: repositorios Prisma, cache, mensageria e tratamento HTTP em `src/infra` e `src/modules/**/infra`.
- Entrega: controllers REST em `src/modules/**/controllers`.
- Coleção de endpoints: pasta `collection` com arquivo exportado contendo as rotas da API.

## Requisitos
- Node.js 20+
- PostgreSQL
- RabbitMQ (opcional)

## Configuração
Copie `.env.example` para `.env` e ajuste os valores.

Variaveis principais:
- `PORT`: porta HTTP da aplicação.
- `APP_TOKEN`: token de aplicação para acesso via header `x-app-token`.
- `PASSWORD_PEPPER`: segredo adicional para hash de senha (manter fora do repositorio).
- `AUTHZ_URL`: endpoint do autorizador externo (GET).
- `NOTIFY_URL`: endpoint do servico de notificacao (POST).
- `POSTGRES_USER`: usuário do PostgreSQL.
- `POSTGRES_PASSWORD`: senha do PostgreSQL.
- `POSTGRES_DB`: nome do banco.
- `POSTGRES_PORT`: porta do PostgreSQL.
- `POSTGRES_HOST`: host do PostgreSQL.
- `DATABASE_URL`: conexao com PostgreSQL.
- `CACHE_TTL_SECONDS`: TTL do cache de saldo.
- `RABBITMQ_ENABLED`: `true` para habilitar mensageria.
- `RABBITMQ_URL`: URL do RabbitMQ.
- `RABBITMQ_DEFAULT_USER` e `RABBITMQ_DEFAULT_PASS`: credenciais do RabbitMQ (docker).

## Autenticacao por token de aplicacao
Todas as rotas exigem o header `x-app-token` com o valor de `APP_TOKEN`.

## IDs
As chaves primarias sao UUID por padrao.

## Endpoints principais
- `POST /users`
- `GET /users?page=1&limit=10`
- `GET /wallets/:userId/balance`
- `POST /wallets/:userId/transactions`
- `GET /wallets?page=1&limit=10`
- `POST /transfers`
- `GET /transfers?page=1&limit=10`
- `GET /transfers/users/:userId`
- `GET /transfers/users/:userId/sent`
- `GET /transfers/users/:userId/received`

Exemplo de `.env` atual:
```
# Application
PORT=4001
APP_TOKEN=5f9be413f841f1b812f86c949b62a93aff08b73f7331f073819d1b809494b905
PASSWORD_PEPPER=4fb9747f74345c532c0efd09913e621fc45ec34a1c2cafe4fb1d854b2f37ca19
AUTHZ_URL=http://localhost:8081/authorize
NOTIFY_URL=https://util.devi.tools/api/v1/notify

# Database
POSTGRES_USER=api_transfer
POSTGRES_PASSWORD=api_transfer
POSTGRES_DB=api_transfer
POSTGRES_PORT=5432
POSTGRES_HOST=localhost
DATABASE_URL=postgresql://api_transfer:api_transfer@localhost:5432/api_transfer?schema=public

# RabbitMQ
RABBITMQ_ENABLED=false
RABBITMQ_URL=amqp://user:pass@localhost:5672
RABBITMQ_DEFAULT_USER=user
RABBITMQ_DEFAULT_PASS=pass
```

## Execução
Instalacao de dependencias:
```
npm install
```

Geração do cliente Prisma:
```
npx prisma generate
```

Migracoes:
```
npx prisma migrate dev
```

Subir infraestrutura local (Postgres e RabbitMQ):
```
docker-compose up -d
```

Build:
```
npm run build
```

Ambiente de desenvolvimento:
```
npm run start:dev
```

## Testes
Execução dos testes:
```
npm test
```

Ha testes E2E com NestJS + Supertest para rotas de usuários, carteiras e transferências.

## Cache
O cache de saldo usa `cache-manager` em memoria. A invalidação ocorre apos transferências para pagador e recebedor. O TTL e configurado por `CACHE_TTL_SECONDS`.

## Mensageria e auditoria
Quando `RABBITMQ_ENABLED=true`, eventos de transferência são publicados no exchange `transfer.events`. Um consumidor grava auditoria no banco (tabela `TransferAudit`).

## CI
Existe um pipeline no GitHub Actions em `.github/workflows/ci.yml` que executa lint, testes e build.
