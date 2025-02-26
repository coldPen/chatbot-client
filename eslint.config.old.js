import boundaries from "eslint-plugin-boundaries";

export default [
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
