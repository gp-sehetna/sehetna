import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { Linter } from "eslint";

const customRules: Linter.Config = {
  rules: {
    // To allow using children prop directly in TSX
    "react/no-children-prop": "off",

    "@typescript-eslint/no-explicit-any": "off"
  }
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  customRules
]);

export default eslintConfig;
