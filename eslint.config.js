import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**']
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  skipFormatting,
  {
    name: 'app/rules',
    rules: {
      // Verve is a UI kit: single-word primitives like `Tooltip` (and future
      // `Button`, `Switch`, `Card`) are idiomatic, matching Radix/shadcn.
      'vue/multi-word-component-names': 'off'
    }
  }
]
