// @ts-check
// Enables TypeScript type checking for this file in editors like VS Code.

import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Export the configuration using the new "Flat Config" format supported by tseslint.
export default tseslint.config(
  {
    // Global ignores: Files or directories that ESLint should never touch.
    // We ignore the config file itself and the build output directory ('dist').
    ignores: ['eslint.config.mjs', 'dist/**'],
  },
  
  // Base JavaScript Rules:
  // Loads standard recommended rules for JavaScript (catches common logic errors).
  eslint.configs.recommended,

  // TypeScript Type-Checked Rules:
  // Loads recommended TypeScript rules that require type information.
  // This is more powerful than syntax-only checks because it understands your variable types.
  ...tseslint.configs.recommendedTypeChecked,

  // Prettier Integration:
  // Turns off ESLint formatting rules that conflict with Prettier and
  // enables the Prettier plugin to report formatting issues as ESLint errors.
  eslintPluginPrettierRecommended,

  {
    languageOptions: {
      // Define global variables so ESLint doesn't flag them as "undefined".
      globals: {
        // Adds Node.js globals (e.g., process, __dirname, exports)
        ...globals.node, 
        // Adds Jest globals for testing (e.g., describe, it, expect)
        ...globals.jest, 
      },
      parserOptions: {
        // Enables the new, faster service for type-aware linting.
        projectService: true,
        // Tells the parser where to find 'tsconfig.json' relative to this file.
        // Necessary for rules that depend on type checking.
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  
  {
    rules: {
      // Custom Rule Overrides

      // "Floating Promises" (Critical Rule):
      // The TypeScript compiler does not catch un-awaited promises by default.
      // This rule throws an error if a Promise is created but not handled (awaited or .catch).
      // Prevents silent failures in asynchronous code.
      '@typescript-eslint/no-floating-promises': 'error',

      // "No Explicit Any":
      // Even with strict mode in tsconfig, you can normally write ': any'.
      // This rule warns you against doing that, forcing you to define proper types.
      '@typescript-eslint/no-explicit-any': 'error',

      // Prettier Rule:
      // Reports Prettier formatting issues as ESLint 'errors'.
      // 'endOfLine: "auto"' prevents errors due to Windows (CRLF) vs Mac/Linux (LF) differences.
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
);
