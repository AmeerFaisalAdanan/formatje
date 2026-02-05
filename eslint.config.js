// ESLint v9+ Flat Config for React (JSX)
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ["**/*.jsx", "**/*.js"],
    plugins: {
      react,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        navigator: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        JSX: true,
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  prettier,
];
