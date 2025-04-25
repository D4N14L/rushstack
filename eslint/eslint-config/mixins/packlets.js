// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

// This mixin implements the "packlet" formalism for organizing source files.
// For more information, see the documentation here:
// https://www.npmjs.com/package/@rushstack/eslint-plugin-packlets

const { defineConfig } = require('eslint/config');
const rushstackPackletsEslintPlugin = require('@rushstack/eslint-plugin-packlets');

export default defineConfig({
  files: ['*.ts', '*.tsx'],
  plugins: {
    '@rushstack/packlets': rushstackPackletsEslintPlugin
  },
  rules: {
    '@rushstack/packlets/mechanics': 'warn',
    '@rushstack/packlets/circular-deps': 'warn'
  }
});
