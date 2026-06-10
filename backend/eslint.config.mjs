import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname
      },
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly"
      }
    },
    rules: {
      "no-undef": "off"
    }
  }
];
