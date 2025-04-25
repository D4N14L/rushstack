// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

// This mixin validates code comments to ensure that they follow the TSDoc standard.  For more
// information please see the README.md for @rushstack/eslint-config.
const { defineConfig } = require('eslint/config');
const tsdocEslintPlugin = require('eslint-plugin-tsdoc');

export default defineConfig({
  files: ['*.ts', '*.tsx'],
  plugins: {
    tsdoc: tsdocEslintPlugin
  },
  rules: {
    'tsdoc/syntax': 'warn'
  }
});
