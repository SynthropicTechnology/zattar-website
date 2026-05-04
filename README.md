# Zattar Advogados — Website

Website institucional e marketing do escritório Zattar Advogados, construído com Next.js e hospedado como PWA standalone.

**Stack**:
- **Core**: Next.js 16 (App Router), React 19, TypeScript 5
- **UI**: Tailwind CSS 4, shadcn/ui (estilo new-york)
- **CMS**: Strapi (conteúdo do blog/insights via API REST)
- **Banco**: Supabase (formulário de contato / leads)
- **Cache / Rate-limit**: Redis (ioredis)
- **Chat**: Chatwoot (widget configurado via Supabase)
- **PWA**: Serwist / Service Worker

## Pré-requisitos

- Node.js `>= 22.0.0`
- npm `>= 10`
- (Opcional) Docker para execução conteinerizada

## Instalação

```bash
npm install
cp .env.example .env.local
# edite .env.local com suas credenciais
```

## Desenvolvimento

```bash
npm run dev        # Turbopack — http://localhost:3000
npm run build      # Build de produção (standalone)
npm run start      # Serve o build de produção
npm run type-check # Verificação de tipos sem emitir
npm run lint       # ESLint
```

## Variáveis de Ambiente

Consulte `.env.example` para a lista completa e anotada.

| Variável | Obrigatória | Descrição |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL pública do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY` | Sim | Chave anon pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Chave de serviço (server-only) |
| `REDIS_URL` | Sim | URL de conexão Redis |
| `STRAPI_URL` | Não | URL base do Strapi CMS |
| `STRAPI_API_TOKEN` | Não | Token de leitura do Strapi |
| `NEXT_PUBLIC_WEBSITE_URL` | Não | URL canônica do site |

## Estrutura

```
src/
├── app/
│   ├── website/          # Páginas públicas (expertise, contato, faq, insights…)
│   ├── servicos/         # Calculadoras e ferramentas públicas
│   ├── api/              # Rotas de API (formulário de contato, CSP report, health)
│   └── offline/          # Página offline (PWA)
├── components/           # Componentes UI compartilhados (shadcn/ui, shared/)
├── lib/                  # Infra: Supabase, Strapi, Redis, Chatwoot
└── middleware/           # Segurança: CSP, rate-limit, headers
```

## Deploy com Docker

```bash
docker build -t zattar-website .
docker run -p 3000:3000 --env-file .env.production zattar-website
```
