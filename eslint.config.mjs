import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  {
    "rules": {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-console": "warn",
      "@typescript-eslint/comma-dangle": [
        "error",
        "never"
      ],
      "@typescript-eslint/semi": [
        "error",
        "never"
      ],
      "@typescript-eslint/quotes": [
        "error",
        "always",
        "double", {
          "avoidEscape": true,
          "allowTemplateLiterals": true
        }
      ],
      "@typescript-eslint/yoda": [
        "error",
        "never"
      ],
      "@typescript-eslint/eqeqeq": [
        "error",
        "always"
      ],
      "@typescript-eslint/prefer-const": [
        "error",
        "always"
      ],
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-explicit-any": "warn"
    }
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
