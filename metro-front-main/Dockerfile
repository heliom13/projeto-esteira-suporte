# ===== Etapa 1: build do React =====
FROM node:18-alpine AS builder
WORKDIR /app

# A URL do backend precisa existir no momento do build (CRA injeta em build-time)
ARG REACT_APP_API_URL=http://localhost:8080
ENV REACT_APP_API_URL=$REACT_APP_API_URL
# Nao falhar o build por causa de warnings do ESLint
ENV CI=false
ENV GENERATE_SOURCEMAP=false

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# ===== Etapa 2: servir os arquivos estaticos com Nginx =====
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
