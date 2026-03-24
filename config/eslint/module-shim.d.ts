declare module '@react-native/eslint-plugin' {
  import type { Rule } from 'eslint'

  const plugin: {
    meta: { name: string; version: string }
    rules: Record<string, Rule.RuleModule>
  }

  export default plugin
}

declare module 'eslint-plugin-react-native' {
  import type { Rule } from 'eslint'

  const plugin: {
    rules: Record<string, Rule.RuleModule>
  }

  export default plugin
}
