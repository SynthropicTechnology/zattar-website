import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import unusedImports from "eslint-plugin-unused-imports";
import noHardcodedSecrets from "./eslint-rules/no-hardcoded-secrets.js";
import noHslVarTokens from "./eslint-rules/no-hsl-var-tokens.js";
import noHardcodedLayout from "./eslint-rules/no-hardcoded-layout.js";
import noRawTextSize from "./eslint-rules/no-raw-text-size.js";
import noShadcnUiMutation from "./eslint-rules/no-shadcn-ui-mutation.js";

const eslintConfig = defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
      "unused-imports": unusedImports,
    },
    settings: {
      react: { version: "detect" },
      "react-runtime": "automatic",
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-html-link-for-pages": "error",
    },
  },
  globalIgnores([
    // Worktrees do harness do Claude Code: pinam commits antigos e
    // inundariam o lint com erros já corrigidos no master.
    ".claude/**",
    // Build artifacts e arquivos auto-gerados.
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    // Regras ESLint customizadas: contêm strings literais que descrevem
    // anti-padrões detectados pelas próprias regras (auto-referência).
    "eslint-rules/**",
    // .env.example tem placeholders que não devem ser parseados como código.
    ".env.example",
  ]),
  {
    plugins: {
      custom: {
        rules: {
          "no-hardcoded-secrets": noHardcodedSecrets,
          "no-hsl-var-tokens": noHslVarTokens,
          "no-hardcoded-layout": noHardcodedLayout,
          "no-raw-text-size": noRawTextSize,
          "no-shadcn-ui-mutation": noShadcnUiMutation,
        },
      },
    },
    rules: {
      "custom/no-hardcoded-secrets": "error",
      "custom/no-hsl-var-tokens": "error",
      "custom/no-hardcoded-layout": "error",
      "custom/no-shadcn-ui-mutation": "error",
    },
  },
  // Tipografia marketing: rotas /website/* e /servicos/* devem consumir
  // sempre <Heading>/<Text> de @/components/ui/typography. Páginas demo
  // (recrutamento) podem usar text-* direto pois são fora do escopo.
  {
    files: ["src/app/website/**/*.{ts,tsx}", "src/app/servicos/**/*.{ts,tsx}", "src/app/page.tsx"],
    ignores: [
      "**/demo/**",
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
    ],
    rules: {
      "custom/no-raw-text-size": "error",
    },
  },
  {
    files: [".env.example"],
    rules: {
      "custom/no-hardcoded-secrets": "off",
    },
  },
  {
    rules: {
      "unused-imports/no-unused-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  // Testes: permitem `any` em mocks e fixtures.
  {
    files: [
      "src/**/__tests__/**/*.{ts,tsx}",
      "src/**/*.test.{ts,tsx}",
      "src/**/*.spec.{ts,tsx}",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  // Governança de Design Tokens: bloqueia cores Tailwind cruas e OKLCH literais.
  // A regra hsl(var(--)) vive em custom/no-hsl-var-tokens (CSS inválido em runtime).
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    ignores: [
      "src/app/globals.css",
      "**/demo/**",
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          // Cores Tailwind cruas (text-red-500, bg-blue-200, etc.) — use tokens semânticos.
          selector:
            "Literal[value=/(?:^|\\s)(?:text|bg|border|ring|fill|stroke|from|to|via)-(?:red|green|blue|yellow|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-\\d/]",
          message:
            "Não use cores Tailwind cruas (ex: text-red-500). Use tokens semânticos: text-success, text-destructive, text-warning, text-info, text-muted-foreground, text-primary.",
        },
        {
          // OKLCH literal sem `from var(--`) — provável valor cru.
          // Permitido: oklch(from var(--token) l c h / alpha) — relative color syntax.
          selector: "Literal[value=/oklch\\(\\s*\\d/]",
          message:
            "Literal OKLCH detectado. Use tokens (--primary, --success, etc.) ou oklch(from var(--token) l c h / alpha) para opacidade. Veja globals.css.",
        },
      ],
    },
  },
]);

export default eslintConfig;
