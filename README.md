# Carona Universitária — Frontend

Interface web da aplicação Carona Universitária, desenvolvida com Next.js,
React, TypeScript e Tailwind CSS.

## Pré-requisitos

Para executar em desenvolvimento:

- Node.js 24;
- pnpm 10;
- backend da aplicação em execução.

Para executar a stack completa com containers:

- Docker;
- Docker Compose.

## Desenvolvimento local

### 1. Inicie o backend

Siga primeiro as instruções de desenvolvimento no `README.md` do diretório
`carona-backend`. Por padrão, a API deve estar disponível em
[http://localhost:3000/api](http://localhost:3000/api).

### 2. Configure o ambiente

Na pasta `carona-frontend`, crie o arquivo `.env` a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

Em Linux ou macOS:

```bash
cp .env.example .env
```

A configuração local padrão é:

```dotenv
API_BASE_URL=http://localhost:3000/api
PORT=3001
NODE_ENV=development
NEXT_PUBLIC_GEOAPIFY_API_KEY=
```

`NEXT_PUBLIC_GEOAPIFY_API_KEY` é opcional. Sem ela, os mapas usam os tiles
públicos do OpenStreetMap. Como toda variável `NEXT_PUBLIC_*` é enviada ao
navegador, não coloque segredos nela.

### 3. Instale as dependências

```bash
pnpm install
```



### 4. Inicie o frontend

```bash
pnpm dev
```

A interface fica disponível em [http://localhost:3001](http://localhost:3001).

## Produção com Docker

O Docker Compose fica no diretório `carona-backend` e inicia PostgreSQL,
backend e frontend em conjunto. As duas pastas do projeto devem permanecer lado
a lado:

```text
carona-web/
├── carona-backend/
└── carona-frontend/
```

Na pasta `carona-backend`, crie o arquivo de ambiente central e inicie a
aplicação:

```powershell
Copy-Item .env.example .env
docker compose up --build -d
```

Em Linux ou macOS:

```bash
cp .env.example .env
docker compose up --build -d
```

Depois que os health checks terminarem:

- frontend: [http://localhost:3001](http://localhost:3001);
- backend e Swagger: [http://localhost:3000/api](http://localhost:3000/api).

Acompanhar os logs:

```bash
docker compose logs -f backend frontend
```

Parar a stack:

```bash
docker compose down
```

Para outras operações, como executar o seed ou apagar o volume local do banco,
consulte o `README.md` do diretório `carona-backend`.

## Validação

```bash
pnpm lint
pnpm check-types
pnpm build
```



## Observação sobre produção

O Dockerfile possui um estágio `production`, mas o `compose.yaml` atual usa o
estágio `development`, um volume com o código-fonte e o servidor do Next.js em
modo de desenvolvimento. O Compose atual é adequado para executar a stack
completa localmente, mas ainda não representa um deploy de produção otimizado.