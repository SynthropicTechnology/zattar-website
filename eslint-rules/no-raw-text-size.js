// @ts-check
/**
 * ESLint rule: no-raw-text-size
 *
 * Detecta classes Tailwind de tamanho de texto cru (text-lg, text-xl, text-2xl,
 * text-3xl, ..., text-9xl) em arquivos de página marketing — onde a tipografia
 * deve sempre vir de <Heading> ou <Text> (@/components/ui/typography).
 *
 * Correto:
 *   <Heading level="marketing-hero">             → 32-64px (clamp)
 *   <Heading level="marketing-section">          → 24-40px (clamp)
 *   <Heading level="marketing-title">            → 20-28px (clamp)
 *   <Heading level="card|subsection|widget">     → 18/16/14px (fixo)
 *   <Text variant="marketing-lead|body|caption"> → 17/18/13px
 *
 * Errado (anti-pattern detectado):
 *   <h1 className="text-4xl md:text-6xl ..."> → bypassa o design system
 *   <h2 className="text-3xl md:text-5xl ...">
 *   <h3 className="text-2xl ..."> ou <h3 className="text-xl ...">
 *   <p className="text-lg ...">
 *
 * Tolerâncias:
 *   - text-xs / text-sm / text-base — são legítimos para labels/helpers
 *   - Tokens semânticos do projeto: text-marketing-{hero,section,title,lead,overline},
 *     text-page-title, text-card-title, etc. (já passam pela variant interna)
 */

// Captura: text-lg, text-xl, text-2xl, ..., text-9xl
// Boundary com \b garante que não captura "text-marketing-hero" (não tem -xl)
// nem text-on-surface, text-primary, etc.
const RAW_SIZE_PATTERN = /\btext-(?:lg|xl|[2-9]xl)\b/;

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow raw Tailwind text-size classes (text-lg, text-xl, text-2xl..text-9xl) in marketing pages. Use <Heading> or <Text> from @/components/ui/typography instead.",
      recommended: true,
    },
    messages: {
      rawTextSize:
        'Tamanho de texto cru detectado (text-lg/xl/2xl/...). Use <Heading level="marketing-{hero,section,title}|card|subsection|widget"> ou <Text variant="marketing-lead|body|caption"> de @/components/ui/typography. Hierarquia canônica: CLAUDE.md.',
    },
    schema: [],
  },
  create(context) {
    function checkString(value, node) {
      if (typeof value === "string" && RAW_SIZE_PATTERN.test(value)) {
        context.report({ node, messageId: "rawTextSize" });
      }
    }

    return {
      Literal(node) {
        checkString(node.value, node);
      },
      TemplateLiteral(node) {
        for (const quasi of node.quasis) {
          if (RAW_SIZE_PATTERN.test(quasi.value.raw)) {
            context.report({ node, messageId: "rawTextSize" });
            return;
          }
        }
      },
    };
  },
};

export default rule;
