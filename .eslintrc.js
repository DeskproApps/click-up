module.exports = {
  root: true,
  ignorePatterns: ["**/*.js", ".dist/**/*", "build/**/*", "dist/**/*"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { ignoreRestSiblings: true, argsIgnorePattern: "^_" },
    ],
    "no-console": "error",
  },
};
