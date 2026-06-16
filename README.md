# Sistema Esteira Suporte

Sistema web interno para gerenciamento de esteira de suporte imobiliário.

## Acesso em Produção

| Serviço | URL |
|---------|-----|
| **Frontend** | https://metro-front-tuna.onrender.com |
| **Backend API** | https://projeto-esteira-suporte.onrender.com |

> Na primeira abertura do dia pode demorar até 1 minuto para carregar (servidor no plano gratuito).

## Estrutura do Repositório

```
projeto-esteira-suporte/
├── metro-api-main/      # Backend — Spring Boot (Kotlin)
├── metro-front-main/    # Frontend — React (TypeScript)
└── DOCUMENTACAO.html    # Documentação técnica completa
```

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Spring Boot 2.7.0 + Kotlin |
| Frontend | React 17 + TypeScript + Ant Design 4 |
| Banco de dados | PostgreSQL (produção) / H2 (local) |
| Deploy | Render (Docker + Static Site) |
| Autenticação | JWT + Spring Security |

## Como Rodar Localmente

### Backend
```bash
cd metro-api-main
./gradlew bootRun
# Disponível em http://localhost:8080
```

### Frontend
```bash
cd metro-front-main
npm install --legacy-peer-deps
npm start
# Disponível em http://localhost:3000
```

## Como Fazer Deploy

Qualquer push para o branch `master` dispara deploy automático no Render.

```bash
git add .
git commit -m "descrição da alteração"
git push origin master
```

## Infraestrutura (Render)

| Serviço | Nome | Tipo | Plano |
|---------|------|------|-------|
| Frontend | `metro-front` | Static Site | Free |
| Backend | `projeto-esteira-suporte` | Web Service (Docker) | Free |
| Banco | `Esteria Suporte` | PostgreSQL | Free |

> ⚠️ O banco de dados Free expira em **17/07/2026**. Fazer upgrade antes dessa data.

## Documentação Completa

Abra o arquivo `DOCUMENTACAO.html` no navegador para ver a documentação técnica completa com todos os detalhes de configuração.
