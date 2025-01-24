const globals = require('globals');
const pluginJs = require('@eslint/js');
const tseslint = require('typescript-eslint');
const pluginVue = require('eslint-plugin-vue');
const pluginPrettierRecommendedConfigs = require('eslint-plugin-prettier/recommended');
// import multiWordComponentNames from "eslint-plugin-vue/lib/rules/multi-word-component-names";
// import parserVue from 'vue-eslint-parser'

// export default [
//   { files: ["**/*.{js,mjs,cjs,ts,vue}"] },
//   { languageOptions: { globals: globals.browser } },
//   pluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
//   ...pluginVue.configs["flat/essential"],
//   {
//     files: ["**/*.vue"],
//     languageOptions: { parserOptions: { parser: tseslint.parser } },
//   },
// ];

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  { ignores: ['**/dist/**/*', '**/src/styles/css/**/*'] },
  // eslint 默认推荐规则
  pluginJs.configs.recommended,
  // ts 默认推荐规则
  ...tseslint.configs.recommended,
  // vue3 基础推荐规则
  ...pluginVue.configs['flat/recommended'],
  // prettier 默认推荐规则
  pluginPrettierRecommendedConfigs,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node,
      },
      ecmaVersion: 2020,
      // parser: parserVue,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 0,
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];

// module.exports = {
//   root: true,
//   parser: '@typescript-eslint/parser',
//   parserOptions: {
//     ecmaVersion: 12,
//     sourceType: 'module',
//   },
//   env: {
//     browser: true,
//     amd: true,
//     node: true,
//   },
//   extends: [
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:prettier/recommended', // Make sure this is always the last element in the array.
//   ],
//   plugins: ['prettier', '@typescript-eslint'],
//   rules: {
//     'prettier/prettier': ['error', {}, { usePrettierrc: true }],
//     'no-unused-vars': 'off',
//     '@typescript-eslint/no-unused-vars': ['error'],
//   },
// };
