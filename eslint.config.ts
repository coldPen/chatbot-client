import pluginJs from "@eslint/js";
// @ts-expect-error eslint-plugin-boundaries does not have types
import boundaries from "eslint-plugin-boundaries";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: [".react-router/**", ".react-router"] },
  { files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  tseslint.configs.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    plugins: {
      boundaries,
    },
    rules: {
      ...boundaries.configs.recommended.rules,
      "boundaries/element-types": [
        2,
        {
          default: "disallow",
          message: "${file.type} is not allowed to import ${dependency.type}",
          rules: [
            // Domain should be independent and not import from other layers
            {
              from: ["domain"],
              allow: ["domain"],
            },

            // Application can import from domain
            {
              from: ["application"],
              allow: ["domain", "application"],
            },

            // Infrastructure layers can import from domain and application
            {
              from: ["completion", "persistence", "presentation"],
              allow: ["domain", "application"],
            },
          ],
        },
      ],
      "boundaries/no-unknown-files": 1,
    },
    settings: {
      // Try different pattern formats
      "boundaries/elements": [
        // Option 1: Mode "full" with full paths
        {
          type: "application",
          pattern: "src/application/**/*",
          mode: "full",
        },
        {
          type: "domain",
          pattern: "src/domain/**/*",
          mode: "full",
        },
        {
          type: "completion",
          pattern: "src/infrastructure/completion/**/*",
          mode: "full",
        },
        {
          type: "persistence",
          pattern: "src/infrastructure/persistence/**/*",
          mode: "full",
        },
        {
          type: "presentation",
          pattern: "src/infrastructure/presentation/**/*",
          mode: "full",
        },

        // Or Option 2: Default mode with just the last part of paths
        // { type: "application", pattern: "application/**/*" },
        // { type: "domain", pattern: "domains/**/*" },
        // { type: "completion", pattern: "completion/**/*" },
        // { type: "persistence", pattern: "persistence/**/*" },
        // { type: "presentation", pattern: "presentation/**/*" },
      ],
      "boundaries/include": ["src/**/*.{js,jsx,ts,tsx}"],
    },
  },
);
