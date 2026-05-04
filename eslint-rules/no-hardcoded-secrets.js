// @ts-check
/**
 * ESLint rule: no-hardcoded-secrets
 * Detecta credenciais e segredos hardcoded em strings literais.
 */

const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/,                    // OpenAI keys
  /eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/, // JWT tokens
  /ghp_[a-zA-Z0-9]{36}/,                    // GitHub personal tokens
  /github_pat_[a-zA-Z0-9_]{82}/,            // GitHub fine-grained tokens
  /xox[baprs]-[a-zA-Z0-9-]{10,}/,           // Slack tokens
  /AIza[a-zA-Z0-9_-]{35}/,                  // Google API keys
  /AKIA[A-Z0-9]{16}/,                       // AWS access keys
];

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow hardcoded secrets and credentials in source code",
      recommended: true,
    },
    messages: {
      hardcodedSecret: "Hardcoded secret detected. Use environment variables instead.",
    },
    schema: [],
  },
  create(context) {
    function checkLiteral(node) {
      if (typeof node.value !== "string") return;
      for (const pattern of SECRET_PATTERNS) {
        if (pattern.test(node.value)) {
          context.report({ node, messageId: "hardcodedSecret" });
          return;
        }
      }
    }

    return {
      Literal: checkLiteral,
      TemplateLiteral(node) {
        for (const quasi of node.quasis) {
          for (const pattern of SECRET_PATTERNS) {
            if (pattern.test(quasi.value.raw)) {
              context.report({ node, messageId: "hardcodedSecret" });
              return;
            }
          }
        }
      },
    };
  },
};

export default rule;
