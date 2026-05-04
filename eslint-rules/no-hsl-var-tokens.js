// @ts-check
/**
 * ESLint rule: no-hsl-var-tokens
 * Detecta o padrão `hsl(var(--token))` em strings, que gera CSS inválido
 * quando os tokens do design system usam OKLCH em vez de HSL.
 *
 * Correto:  var(--primary) / oklch(from var(--primary) l c h / 0.5)
 * Errado:   hsl(var(--primary)) → CSS inválido com tokens OKLCH
 */

const HSL_VAR_PATTERN = /hsl\(var\(--[a-zA-Z0-9-]+\)/;

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow hsl(var(--token)) pattern which is invalid CSS with OKLCH tokens",
      recommended: true,
    },
    messages: {
      hslVarToken:
        "hsl(var(--token)) is invalid CSS when tokens use OKLCH. Use var(--token) directly, or oklch(from var(--token) l c h / alpha) for opacity.",
    },
    schema: [],
  },
  create(context) {
    function checkString(value, node) {
      if (typeof value === "string" && HSL_VAR_PATTERN.test(value)) {
        context.report({ node, messageId: "hslVarToken" });
      }
    }

    return {
      Literal(node) {
        checkString(node.value, node);
      },
      TemplateLiteral(node) {
        for (const quasi of node.quasis) {
          if (HSL_VAR_PATTERN.test(quasi.value.raw)) {
            context.report({ node, messageId: "hslVarToken" });
            return;
          }
        }
      },
    };
  },
};

export default rule;
