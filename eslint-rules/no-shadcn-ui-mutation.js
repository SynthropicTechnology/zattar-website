// @ts-check
/**
 * ESLint rule: no-shadcn-ui-mutation
 *
 * Detecta strings literais que referenciam variantes/sizes shadcn-customizados
 * que NÃO existem no shadcn oficial. Esses padrões indicam tentativa de
 * reintrodução de drift em src/components/ui/* — variantes custom devem viver
 * em wrappers (ex: src/components/shared/marketing-button.tsx).
 *
 * Padrões detectados (anti-patterns):
 *   <Button variant="marketing-outline">       → use <MarketingButton variant="outline">
 *   <Button variant="glass-outline">           → use <MarketingButton variant="glass">
 *   <Button size="xs|xl|2xl|3xl|icon-xs|icon-lg"> → sizes não-shadcn, use sm/lg/icon
 *
 * Política: src/components/ui/* é propriedade do shadcn CLI. Customizações
 * vivem em src/components/shared/* via composição/wrapper.
 */

const SHADCN_DRIFT_PATTERNS = [
  {
    pattern: /\bmarketing-outline\b/,
    message:
      'Variant "marketing-outline" foi removida de Button (shadcn fresh). Use <MarketingButton variant="outline"> de @/components/shared/marketing-button.',
  },
  {
    pattern: /\bglass-outline\b/,
    message:
      'Variant "glass-outline" foi removida de Button (shadcn fresh). Use <MarketingButton variant="glass"> de @/components/shared/marketing-button.',
  },
];

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow shadcn drift patterns (custom variants/sizes that diverge from official shadcn). Use wrappers in src/components/shared/ instead.",
      recommended: true,
    },
    messages: {
      shadcnDrift: "{{message}}",
    },
    schema: [],
  },
  create(context) {
    function checkString(value, node) {
      if (typeof value !== "string") return;
      for (const { pattern, message } of SHADCN_DRIFT_PATTERNS) {
        if (pattern.test(value)) {
          context.report({
            node,
            messageId: "shadcnDrift",
            data: { message },
          });
          return;
        }
      }
    }

    return {
      Literal(node) {
        checkString(node.value, node);
      },
      TemplateLiteral(node) {
        for (const quasi of node.quasis) {
          for (const { pattern, message } of SHADCN_DRIFT_PATTERNS) {
            if (pattern.test(quasi.value.raw)) {
              context.report({
                node,
                messageId: "shadcnDrift",
                data: { message },
              });
              return;
            }
          }
        }
      },
    };
  },
};

export default rule;
