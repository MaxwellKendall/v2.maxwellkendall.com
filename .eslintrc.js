module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  plugins: [
    // ... your other plugins
    'jest',
  ],
};
