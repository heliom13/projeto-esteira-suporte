# Como rodar a Esteira Suporte (pacote completo)

Este repositório roda **inteiro** com um comando, em qualquer máquina que tenha
**Docker**. Sobe três coisas juntas:

- **db** — banco de dados PostgreSQL
- **backend** — a API (Kotlin/Spring) em `http://localhost:8080`
- **frontend** — o site (React) em `http://localhost:3000`

---

## Pré-requisito
Instalar o **Docker Desktop** (Windows/Mac) ou **Docker Engine + Compose** (Linux).
É a única coisa que precisa estar instalada na máquina.

---

## Passo a passo (local)

```bash
# 1) Entrar na pasta do projeto
cd projeto-esteira-suporte

# 2) Criar o arquivo de configuração a partir do exemplo
cp .env.example .env
#    -> abra o .env e troque as senhas/chaves (veja os comentários lá dentro)

# 3) Subir tudo (a primeira vez demora, pois constrói as imagens)
docker compose up -d --build

# 4) Abrir no navegador
#    Frontend: http://localhost:3000
#    API:      http://localhost:8080/actuator/health
```

Parar tudo: `docker compose down`
(os dados do banco **continuam salvos** no volume `pgdata`).

Ver logs: `docker compose logs -f backend`

---

## Rodar em um servidor (VPS / nuvem)

É o mesmo processo, só mudam os endereços. Num servidor com Docker:

1. Copie a pasta do projeto para o servidor (git clone ou upload).
2. Crie o `.env` e ajuste:
   - `REACT_APP_API_URL` = endereço público do backend (ex: `https://api.seudominio.com`)
   - `CORS_ALLOWED_ORIGINS` = endereço público do frontend (ex: `https://seudominio.com`)
   - `APP_FRONT_URL` = o mesmo do frontend
   - senhas e chaves fortes (nunca use as de exemplo em produção)
3. `docker compose up -d --build`
4. (Recomendado) colocar um proxy reverso (Nginx/Caddy/Traefik) na frente para
   HTTPS e para apontar o domínio para as portas 3000 (frontend) e 8080 (backend).

> **Importante:** `REACT_APP_API_URL` é injetado no **build** do frontend.
> Se mudar esse valor, reconstrua o frontend: `docker compose build frontend`.

---

## Levar os dados junto (backup / restauração)

O código vai na pasta, mas os **dados dos clientes não** — eles vivem no banco.
As tabelas são criadas sozinhas ao subir (Hibernate `ddl-auto: update`), mas um
banco novo começa **vazio**. Para trazer os dados de um banco existente:

**Fazer o backup (do banco atual, ex: o do Render):**
```bash
pg_dump "postgresql://USUARIO:SENHA@HOST/NOME_DB" -F c -f backup_esteira.dump
```

**Restaurar no banco deste pacote (com o compose já no ar):**
```bash
# copia o dump para dentro do container do banco
docker compose cp backup_esteira.dump db:/tmp/backup_esteira.dump
# restaura
docker compose exec db pg_restore -U esteira -d esteira --clean --if-exists /tmp/backup_esteira.dump
```

---

## Primeiro acesso
Se o banco subir vazio, o sistema cria a estrutura inicial automaticamente
(ver `configs/DataInitializer.kt` no backend). Caso não exista um usuário
administrador, crie-o pela rotina de inicialização / cadastro de usuários.

---

## Resumo do que cada arquivo faz
| Arquivo | Função |
|---|---|
| `docker-compose.yml` | orquestra banco + backend + frontend |
| `.env` (criado por você) | senhas, chaves e endereços |
| `.env.example` | modelo do `.env` |
| `metro-api-main/Dockerfile` | empacota o backend |
| `metro-front-main/Dockerfile` | empacota o frontend (build + Nginx) |
| `metro-front-main/nginx.conf` | serve o site e trata as rotas do React |
