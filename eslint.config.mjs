// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt().override('nuxt/typescript', {
  rules: {
    // ...Override rules, for example:
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  }
})
