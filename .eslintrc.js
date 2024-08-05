module.exports = {
  root: true,
  ignorePatterns: ["**/*.js", ".dist/**/*", "build/**/*", "dist/**/*"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
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
