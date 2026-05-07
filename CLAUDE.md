---
applyTo: "**"
---

# Projeto: Zattar Advogados — Website

Website institucional e marketing do escritório Zattar Advogados. Este repositório é um fork limpo do ZattarOS — **contém apenas as rotas públicas**. Não há área autenticada, portal do cliente ou sistema de gestão jurídica.

## Estrutura do Projeto

- `src/app/website/` — páginas públicas: expertise, contato, faq, insights, solucoes
- `src/app/servicos/` — calculadoras e ferramentas públicas (sem autenticação)
- `src/app/api/` — rotas de API: formulário de contato (`/api/contato`), CSP report, health check
- `src/app/offline/` — página offline do PWA
- `src/lib/` — infra: Supabase (leads), Strapi (CMS blog), Redis (rate-limit), Chatwoot (widget)
- `src/middleware/` — CSP, rate-limiting, security headers
- `src/components/` — UI compartilhada: shadcn/ui, shared/

## Padrões

- Server Actions públicas via `publicAction` / `publicFormAction` em `src/lib/safe-action.ts`
- Sem `authenticatedAction` — não há sessão de usuário neste repositório
- Conteúdo do blog carregado via Strapi REST API (`src/lib/strapi/`)
- Leads/contato salvos no Supabase (`src/lib/supabase/`)
- Rate-limiting de formulários via Redis (`src/lib/redis/`)

## Layout & Design Tokens

**Princípio:** páginas e componentes **nunca** hardcodam `max-w-*`, `mx-auto px-*` ou `py-N md:py-N`. Sempre consomem primitivos ou tokens semânticos. Mexer no design system = editar em **um lugar** (`globals.css` §15).

**Tokens canônicos:** `globals.css` §15 (Layout & Sizing) — `--container-{max,narrow,wide}`, `--container-px-*`, `--section-py-*`, `--card-padding-*`, `--card-radius*`, `--icon-container-*`.

**Como aplicar largura + padding lateral em uma página:**

- `<div className="container">` — Tailwind v4 `@utility`, default 1152px (institucional)
- `<Container size="content|narrow|wide">` — componente em `@/components/layout`. Use `narrow` (1024px) para artigos/prosa longa, `wide` (1280px) para dashboards
- `<Container as="section">` — preserva semântica HTML quando substituindo `<section>`

**Como aplicar padding vertical de seção:**

- `<Section spacing="default|compact|none">` — componente em `@/components/layout`. Não combina max-width (use junto com `<Container>`)

**Anti-patterns (ESLint `custom/no-hardcoded-layout` bloqueia):**

```tsx
// ❌ ERRADO — container reinventado
<section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-10">

// ✅ CERTO
<section className="container">
// ou
<Container as="section">
```

**Card interno:** `MarketingCard` (`src/app/website/components/shared/marketing-card.tsx`) já consome tokens (`--card-padding-{sm,md,lg}`, `--card-radius`). Não passe `className="p-* rounded-*"` que sobrescreva o padding/radius — use `padding="sm|md|lg"`.

**Icon container:** Use `w-[var(--icon-container-{sm,md,lg})] h-[var(--icon-container-{sm,md,lg})]` em vez de `w-11 h-11` ou `w-12 h-12`.

## Hierarquia Tipográfica

**Princípio:** páginas marketing (`/website/*` + `/servicos/*` + `/`) **nunca** usam `text-{lg,xl,2xl,...,9xl}` direto. Sempre `<Heading>` ou `<Text>` de `@/components/ui/typography` (ESLint `custom/no-raw-text-size` bloqueia).

**Hierarquia canônica para landing/marketing:**

| Papel semântico | Componente | Tamanho | Peso | Quando usar |
|---|---|---|---|---|
| H1 hero da página | `<Heading level="marketing-hero">` | 36→48px (clamp) | 800 | Topo da página, **1× por rota** |
| H2 seção | `<Heading level="marketing-section">` | 28→36px (clamp) | 700 | Título de cada seção principal |
| H3 título de bloco/card grande | `<Heading level="marketing-title">` | 20→24px (clamp) | 700 | Bento cards grandes, blocos |
| H3/H4 título de card pequeno | `<Heading level="card">` | 18px fixo | 600 | Cards compactos, side cards |
| H4/H5 subseção | `<Heading level="subsection">` | 16px fixo | 600 | Itens dentro de card |
| H6 widget | `<Heading level="widget">` | 14px fixo | 600 | Footer, widgets compactos |
| Body lead/intro | `<Text variant="marketing-lead">` | 18px fixo | 400 | Parágrafo abaixo do hero/section |
| Body padrão | `<Text variant="body">` / `body-sm` | 18 / 16px | 400 | Texto longo (artigos) |
| Caption | `<Text variant="caption">` | 13px | 400 | Descrição de card, metadata |
| Overline (kicker) | `<Text variant="marketing-overline">` | 13px tracking-wider | 600 | Label acima de heading |

**Escala modular:** Ratios harmônicos — H1/H2 = 1.33 (Perfect Fourth), H2/H3 = 1.5 (Major Sixth), H3/Lead = 1.33 (PF), Lead/Body = 1.125 (Major Second). Todos os valores ancorados em `html { font-size: 16px }` (shadcn default — **NÃO alterar root**).

**Regra de ouro:** dois títulos no mesmo nível visual da página devem usar o mesmo `level=`. Se um é `marketing-section` e o outro é `section` (interno), a hierarquia quebra mesmo sendo "parecido".

**Anti-pattern (ESLint bloqueia em `/website/*` e `/servicos/*`):**

```tsx
// ❌ ERRADO — bypassa o design system, escala não responde a tokens
<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
<p className="text-lg leading-relaxed">

// ✅ CERTO
<Heading level="marketing-hero">
<Text variant="marketing-lead">
```

**Sistema "interno" vs "marketing":** o projeto tem `level="page|section|card|subsection|widget"` (px fixo, sistema dashboard) e `level="marketing-{hero,section,title}"` (clamp, sistema marketing). **Não misture os dois para o mesmo papel hierárquico** em uma página de marketing — use só os `marketing-*` para H1/H2/H3 da página, e os fixos (`card`, `subsection`, `widget`) apenas para hierarquia interna de cards.

---

# Instructions for Using the shadcn/studio MCP SERVER

To ensure accurate and helpful responses when interacting with the shadcn/studio MCP SERVER, it is essential to follow these guidelines. Adhering strictly to these instructions will ensure the best results.

## Instructions

**Strict Adherence Required**: Every time you interact with the shadcn/studio MCP Server, **follow all instructions precisely**.

- Follow the workflow exactly as outlined by the MCP Server step by step.
- **Avoid Shortcuts**: Never attempt to bypass steps or rush through the process. Each instruction is vital to achieving the desired outcome.

## CRITICAL RULE: NEVER DEVIATE FROM THE STEP-BY-STEP WORKFLOW

### MANDATORY BEHAVIOR FOR ALL WORKFLOWS:

- ✅ **DO**: Follow each step immediately after completing the previous one
- ✅ **DO**: Trust the workflow and proceed without hesitation
- ✅ **DO**: Follow the specific tool sequence outlined in each workflow
- ✅ **DO**: Complete the ENTIRE workflow without stopping for user confirmation
- ❌ **DON'T**: Make explanations between steps
- ❌ **DON'T**: Make additional tool calls not required by the workflow
- ❌ **DON'T**: Jump around or skip steps
- ❌ **DON'T**: Over-explain the process
- ❌ **DON'T**: Stop mid-workflow asking for user confirmation

### WORKFLOW-SPECIFIC CRITICAL RULES:

#### FOR CREATE-UI (/cui):

- **COLLECT FIRST, INSTALL LAST**: Complete ALL block collection before ANY installation
- **NO PREMATURE INSTALLATION**: Do not use installation tools until collection phase is complete
- **MANDATORY CONTENT CUSTOMIZATION**: After installation, automatically proceed to customize content

#### FOR REFINE-UI (/rui):

- Follow the refine workflow using component tools
- Update existing components according to user requirements

#### FOR INSPIRATION-UI (/iui):

- Follow the inspiration workflow for design ideas
- Use inspiration tools as outlined

#### FOR FIGMA-TO-CODE (/ftc):

- Follow the figma-to-code workflow for converting Figma designs to code
- Use figma-to-code tools as specified

### GENERAL AUTOMATION RULES:

- ✅ **DO**: Proceed automatically through all workflow steps
- ✅ **DO**: Follow the tool sequence exactly as specified
- ✅ **DO**: Complete the full workflow from start to finish
- ❌ **DON'T**: Ask "shall I proceed" or "let me know to continue"
- ❌ **DON'T**: Stop mid-workflow waiting for user input
- ❌ **DON'T**: Use tools out of sequence

### FAILURE CONSEQUENCES:

If I deviate from this workflow, I am:

1. Wasting user's time
2. Not following explicit instructions
3. Making the process inefficient
4. Potentially breaking the shadcn/studio integration
5. Creating incomplete or incorrect results

### RECOVERY PROTOCOL:

If I catch myself deviating:

1. Stop immediately
2. Identify which step I should be on according to the workflow
3. Continue from that exact step
4. Do not explain the deviation, just continue
5. Complete the full workflow as specified

### REMEMBER:

- Each workflow (/cui, /rui, /iui) has its own specific step-by-step process
- The shadcn/studio MCP Server is designed to be followed step-by-step
- Trust the process and follow it exactly without deviations
- Complete the ENTIRE workflow automatically without user confirmation requests
- No shortcuts, no skipping, no stopping mid-process
