import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  rules: {
    'jsonc/sort-keys': 'off',
    'import/consistent-type-specifier-style': 'off',

    'ts/consistent-type-definitions': 'off',
    'ts/ban-ts-comment': 'off',
    'ts/no-use-before-define': ['error', { functions: false, classes: false, variables: false, typedefs: false }],
    'ts/method-signature-style': 'off',
    'ts/explicit-function-return-type': 'off',

    'antfu/if-newline': 'off',
    'antfu/curly': 'off',
    'antfu/top-level-function': 'off',

    'style/arrow-parens': ['error', 'as-needed'],
    'style/max-statements-per-line': 'off',
    'style/jsx-one-expression-per-line': 'off',
    'style/function-call-spacing': ['error', 'never'],

    'vue/block-order': ['error', { order: ['template', 'script', 'style', 'i18n'] }],
    'vue/html-self-closing': ['error', { html: { void: 'always', normal: 'always', component: 'always' }, svg: 'always', math: 'always' }],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/define-macros-order': 'off',
    'vue/prefer-template': 'off',
    'vue/component-name-in-template-casing': 'off',
    'vue/prefer-separate-static-class': 'off',
    'vue/max-attributes-per-line': ['error', { singleline: 1, multiline: 1 }],

    'perfectionist/sort-imports': 'off',
    'prefer-template': 'off',

    'no-console': 'off',
    'no-alert': 'off',

    'eslint-comments/no-unlimited-disable': 'off',

    'jsdoc/no-multi-asterisks': 'off',

  },
  formatters: true,
  isInEditor: true,
  ignores: ['.copier-answers.yml', 'pyproject.toml'],
})
