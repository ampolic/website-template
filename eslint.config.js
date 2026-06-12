import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import astro from "eslint-plugin-astro";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";
import checkFile from "eslint-plugin-check-file";
import importX from "eslint-plugin-import-x";
import jsonc from "eslint-plugin-jsonc";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unicorn from "eslint-plugin-unicorn";
import jsoncParser from "jsonc-eslint-parser";
import tseslint from "typescript-eslint";

const sourceImportRestrictions = {
  patterns: [
    {
      group: ["./*", "../*"],
      message: "Use @/... absolute imports inside src/.",
    },
  ],
};

export default defineConfig([
  {
    ignores: [
      "dist/**",
      ".astro/**",
      ".lighthouseci/**",
      "node_modules/**",
      "public/**",
      "src/components/ui/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs["jsx-a11y-recommended"],
  {
    files: ["*.config.{js,mjs}", "astro.config.mjs"],
    languageOptions: {
      globals: {
        process: "readonly",
      },
    },
  },
  {
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          project: "./tsconfig.json",
        }),
      ],
      "better-tailwindcss": {
        entryPoint: "./src/styles/global.css",
      },
    },
    plugins: {
      "better-tailwindcss": betterTailwindcss,
      "check-file": checkFile,
      "import-x": importX,
      "simple-import-sort": simpleImportSort,
      unicorn,
    },
    rules: {
      curly: ["error", "all"],
      eqeqeq: ["error", "always"],
      "import-x/named": "error",
      "import-x/no-cycle": "error",
      "import-x/no-duplicates": "error",
      "import-x/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "*.config.{js,mjs,ts}",
            "commitlint.config.ts",
            "eslint.config.js",
            "scripts/**/*.ts",
            "src/**/tests/**/*.{ts,tsx}",
            "src/test/**/*.ts",
          ],
        },
      ],
      "import-x/no-self-import": "error",
      "import-x/no-unresolved": [
        "error",
        {
          ignore: ["^astro:(content|assets)$", "^astro/(loaders|zod)$"],
        },
      ],
      "import-x/no-useless-path-segments": "error",
      "no-alert": "error",
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-else-return": "error",
      "no-lonely-if": "error",
      "no-nested-ternary": "error",
      "no-param-reassign": "error",
      "object-shorthand": "error",
      "prefer-const": "error",
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": "error",
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            kebabCase: true,
            pascalCase: true,
          },
        },
      ],
      "unicorn/no-array-for-each": "error",
      "unicorn/no-useless-undefined": "error",
      "unicorn/prefer-string-replace-all": "error",
      "unicorn/prefer-node-protocol": "error",
      "unicorn/prefer-ternary": "off",
      "better-tailwindcss/enforce-canonical-classes": "error",
      "better-tailwindcss/enforce-consistent-important-position": "error",
      "better-tailwindcss/no-conflicting-classes": "error",
      "better-tailwindcss/no-unknown-classes": "off",
    },
  },
  {
    rules: {
      "astro/no-set-html-directive": "error",
      "astro/no-unsafe-inline-scripts": "error",
      "astro/no-unused-css-selector": "error",
      "astro/prefer-class-list-directive": "error",
      "astro/prefer-object-class-list": "error",
      "astro/prefer-split-class-list": "error",
    },
  },
  {
    files: ["src/components/shared/Seo.astro"],
    rules: {
      "astro/no-set-html-directive": "off",
    },
  },
  {
    files: ["src/**/*.{css,md}"],
    plugins: {
      "check-file": checkFile,
    },
    processor: "check-file/eslint-processor-check-file",
  },
  {
    files: ["**/*.json"],
    languageOptions: {
      parser: jsoncParser,
    },
    plugins: {
      jsonc,
    },
    rules: {
      "jsonc/no-dupe-keys": "error",
    },
  },
  {
    files: ["src/**/*.{astro,css,md,ts,tsx}", "scripts/**/*.ts"],
    plugins: {
      "check-file": checkFile,
    },
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        {
          "scripts/**/*.ts": "KEBAB_CASE",
          "src/content[.]config.ts": "content[.]config",
          "src/env[.]d.ts": "env[.]d",
          "src/components/{layout,shared}/**/*.{astro,tsx}": "PASCAL_CASE",
          "src/config/**/*.ts": "KEBAB_CASE",
          "src/content/**/*.md": "KEBAB_CASE",
          "src/features/**/*.ts": "KEBAB_CASE",
          "src/features/**/*.tsx": "PASCAL_CASE",
          "src/layouts/**/*.astro": "PASCAL_CASE",
          "src/lib/**/*.ts": "KEBAB_CASE",
          "src/pages/!(*.*).{astro,ts}":
            "@(404|index|+([a-z0-9])*(-+([a-z0-9])))",
          "src/pages/robots[.]txt.ts": "robots[.]txt",
          "src/styles/**/*.css": "KEBAB_CASE",
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "scripts/**/": "KEBAB_CASE",
          "src/**/": "KEBAB_CASE",
        },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports",
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-empty-object-type": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["src/env.d.ts"],
    rules: {
      "@typescript-eslint/consistent-type-definitions": "off",
    },
  },
  {
    files: ["src/**/*.{astro,ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", sourceImportRestrictions],
    },
  },
  {
    files: ["src/pages/**/*.{astro,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          ...sourceImportRestrictions,
          paths: [
            {
              name: "astro:content",
              message:
                "Use feature helpers from src/features/ instead of querying content directly in pages.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/config/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            ...sourceImportRestrictions.patterns,
            {
              group: [
                "@/components/*",
                "@/features/*",
                "@/layouts/*",
                "@/pages/*",
              ],
              message:
                "Config modules must stay data-only. Move UI, layout, page, or feature imports elsewhere.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/components/**/*.{astro,ts,tsx}", "src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            ...sourceImportRestrictions.patterns,
            {
              group: ["@/layouts/*"],
              message:
                "Layouts should be composed by pages, not nested inside components/features.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            ...sourceImportRestrictions.patterns,
            {
              group: ["@/layouts/*"],
              message:
                "Layouts should be composed by pages, not nested inside components/features.",
            },
            {
              group: ["@/features/*/*"],
              message:
                "Do not import across features. Promote shared code to src/lib or src/components/shared.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.tsx"],
    plugins: {
      "jsx-a11y": jsxA11y,
      "react-hooks": reactHooks,
    },
    rules: {
      ...jsxA11y.flatConfigs.strict.rules,
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    files: ["src/**/tests/**/*.{ts,tsx}", "src/test/**/*.ts"],
    rules: {
      "check-file/filename-naming-convention": "off",
      "check-file/folder-naming-convention": "off",
      "no-restricted-imports": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
    },
  },
]);
