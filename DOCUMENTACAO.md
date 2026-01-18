# API de Transferência

## Visao geral
Este projeto implementa uma API REST para transferências entre usuarios comuns e lojistas, utilizando NestJS e Prisma. A solucao organiza domínio, casos de uso e infraestrutura em modulos, com separacao clara de responsabilidades.

## Funcionalidades
- Criacao de usuarios com validacao de dados.
- Consulta de saldo por usuario.
- Criacao de transferências com regras de negócio (saldo, perfil e autorização).
- Notificação pos-transferência via mensageria (RabbitMQ), com auditoria persistida.
- Cache de saldo com TTL configuravel.
- Documentacao Swagger em `/docs`.

## Arquitetura
- Dominio: entidades, enums, políticas e erros em `src/domain`.
- Aplicação: casos de uso em `src/modules/**/services`.
- Infraestrutura: repositorios Prisma, cache, mensageria e tratamento HTTP em `src/infra` e `src/modules/**/infra`.
- Entrega: controllers REST em `src/modules/**/controllers`.

## Requisitos
- Node.js 20+
- PostgreSQL
- RabbitMQ (opcional)

## Configuração
Copie `.env.example` para `.env` e ajuste os valores.

Variaveis principais:
- `PORT`: porta HTTP da aplicação.
- `APP_TOKEN`: token de aplicação para acesso via header `x-app-token`.
- `POSTGRES_USER`: usuario do PostgreSQL.
- `POSTGRES_PASSWORD`: senha do PostgreSQL.
- `POSTGRES_DB`: nome do banco.
- `POSTGRES_PORT`: porta do PostgreSQL.
- `POSTGRES_HOST`: host do PostgreSQL.
- `DATABASE_URL`: conexao com PostgreSQL.
- `CACHE_TTL_SECONDS`: TTL do cache de saldo.
- `RABBITMQ_ENABLED`: `true` para habilitar mensageria.
- `RABBITMQ_URL`: URL do RabbitMQ.
- `RABBITMQ_DEFAULT_USER` e `RABBITMQ_DEFAULT_PASS`: credenciais do RabbitMQ (docker).

Exemplo de `.env` atual:
```
# Application
PORT=4001
APP_TOKEN=5f9be413f841f1b812f86c949b62a93aff08b73f7331f073819d1b809494b905

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

Ha testes E2E com NestJS + Supertest para rotas de usuarios, carteiras e transferências.

## Cache
O cache de saldo usa `cache-manager` em memoria. A invalidação ocorre apos transferências para pagador e recebedor. O TTL e configurado por `CACHE_TTL_SECONDS`.

## Mensageria e auditoria
Quando `RABBITMQ_ENABLED=true`, eventos de transferência são publicados no exchange `transfer.events`. Um consumidor grava auditoria no banco (tabela `TransferAudit`).

## CI
Existe um pipeline no GitHub Actions em `.github/workflows/ci.yml` que executa lint, testes e build.
