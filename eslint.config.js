import pluginJs from "@eslint/js";
import boundaries from "eslint-plugin-boundaries";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: [".react-router/**", ".react-router"] },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    plugins: {
      boundaries,
    },
    rules: {
      ...boundaries.configs.recommended.rules,
    },
    settings: {
      "boundaries/elements": [
        { type: "application", pattern: "src/application/*" },
        { type: "domain", pattern: "src/domains/*" },
        { type: "completion", pattern: "src/infrastructure/completion/*" },
        { type: "persistence", pattern: "src/infrastructure/persistence/*" },
        { type: "presentation", pattern: "src/infrastructure/presentation/*" },
      ],
    },
  },
];
