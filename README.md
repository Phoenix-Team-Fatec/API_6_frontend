# API_6 Frontend

Frontend da aplicação de regras de negócio, desenvolvido com Vue 3 + Vite.

## Pré-requisitos

- Node.js 18+
- npm 9+

Para conferir versões instaladas:

```bash
node -v
npm -v
```

## 1. Clonar e entrar na pasta

```bash
git clone <url-do-repositorio>
cd API_6_frontend
```

## 2. Configurar variáveis de ambiente

Crie o arquivo `.env` com base no `.env.example`.

Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

Linux/macOS:

```bash
cp .env.example .env
```

Depois, edite o `.env` conforme seu cenário.

Exemplo:

```env
VITE_API_URL=http://localhost:8080
VITE_USE_MOCK=true
VITE_USE_BACKEND=true
VITE_USE_AI=false
```

### O que cada variável faz

- `VITE_API_URL`: URL base do backend.
- `VITE_USE_MOCK`: ativa dados mockados no frontend (`true`/`false`).
- `VITE_USE_BACKEND`: ativa chamadas ao backend real (`true`/`false`).
- `VITE_USE_AI`: ativa interpretação por IA (`true`/`false`).

Sugestão de uso local:

- Backend rodando localmente: `VITE_USE_BACKEND=true`.
- Sem backend disponível: mantenha `VITE_USE_MOCK=true` para testar a UI.

## 3. Instalar dependências

```bash
npm install
```

## 4. Rodar em desenvolvimento

```bash
npm run dev
```

O Vite exibirá no terminal a URL local (geralmente `http://localhost:5173`).

## Scripts disponíveis

- `npm run dev`: inicia o servidor de desenvolvimento.
- `npm run build`: gera build de produção na pasta `dist/`.
- `npm run preview`: sobe um servidor local para testar o build de produção.

## Build de produção

```bash
npm run build
```

Para validar o build localmente:

```bash
npm run preview
```

## Troubleshooting rápido

- Erro de porta em uso no `npm run dev`:
	- encerre o processo que está usando a porta ou rode em outra porta.
- Tela sem dados:
	- verifique se o `.env` está correto.
	- confirme se o backend está ativo em `VITE_API_URL`.
	- para testar rapidamente, use `VITE_USE_MOCK=true`.

## Stack

- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- Tailwind CSS

---
