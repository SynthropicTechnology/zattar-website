// @ts-check
/**
 * ESLint rule: no-hardcoded-layout
 *
 * Detecta containers hardcoded em strings de className: a presença simultânea de
 * max-width grande (5xl/6xl/7xl) + mx-auto + padding lateral (px-/pl-/pr-)
 * indica que o autor reinventou o container institucional manualmente.
 *
 * Correto:
 *   <div className="container">              (Tailwind v4 @utility, globals.css)
 *   <Container size="content|narrow|wide">    (componente, src/components/layout)
 *
 * Errado (anti-pattern detectado):
 *   <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-10">
 *   <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 *
 * Tolerâncias:
 *   - max-w-2xl/3xl/4xl + mx-auto (texto/prosa, não container de página)
 *   - max-w-* sem mx-auto OU sem padding lateral (uso legítimo)
 *
 * Tokens canônicos: globals.css §15 (Layout & Sizing Tokens).
 */

// Match: classNames que contenham TODOS os 3 sinais simultaneamente.
// max-w-(5xl|6xl|7xl|350|352) capturados — tamanhos típicos de container de página.
// max-w-2xl/3xl/4xl ficam de fora intencionalmente (uso legítimo para prosa).
const HARDCODED_CONTAINER_PATTERN =
  /\bmax-w-(?:5xl|6xl|7xl|350|352)\b[^"]*\bmx-auto\b[^"]*\b(?:px-|pl-|pr-)/;

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow hardcoded page containers (max-w-{5,6,7}xl + mx-auto + px-*). Use <Container> or className=\"container\" instead.",
      recommended: true,
    },
    messages: {
      hardcodedLayout:
        'Container hardcoded detectado (max-w-* + mx-auto + px-*). Use className="container" (Tailwind v4 @utility) ou <Container size="content|narrow|wide"> de @/components/layout. Tokens em globals.css §15.',
    },
    schema: [],
  },
  create(context) {
    function checkString(value, node) {
      if (typeof value === "string" && HARDCODED_CONTAINER_PATTERN.test(value)) {
        context.report({ node, messageId: "hardcodedLayout" });
      }
    }

    return {
      Literal(node) {
        checkString(node.value, node);
      },
      TemplateLiteral(node) {
        for (const quasi of node.quasis) {
          if (HARDCODED_CONTAINER_PATTERN.test(quasi.value.raw)) {
            context.report({ node, messageId: "hardcodedLayout" });
            return;
          }
        }
      },
    };
  },
};

export default rule;
