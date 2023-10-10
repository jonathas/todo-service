module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'max-params-no-constructor', 'security', 'sonarjs'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:security/recommended',
    'plugin:sonarjs/recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'comma-dangle': 0,
    '@typescript-eslint/explicit-member-accessibility': ['error'],
    '@typescript-eslint/no-var-requires': 'off',
    'max-len': ['error', { code: 100, ignorePattern: '^import' }],
    'require-await': 'error',
    'no-return-await': 'error',
    'arrow-parens': ['warn', 'always'],
    eqeqeq: ['error', 'always'],
    'max-params-no-constructor/max-params-no-constructor': ['error', 3],
    'security/detect-object-injection': 0,
    curly: 'error',
    'no-undef-init': 'error',
    'prefer-const': 'error',
    'no-eq-null': 'error',
    'no-console': 'error',
    'max-depth': ['error', 3],
    'no-control-regex': 0,
    '@typescript-eslint/no-floating-promises': ['error'],
    'no-continue': 'warn',
    'no-else-return': ['error', { allowElseIf: true }],
    'no-duplicate-imports': 'error',
    'sonarjs/no-duplicate-string': ['error', { 'threshold': 5 }],
    'lines-between-class-members': ['error', 'always'],
    'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
    'max-lines': ['warn', { max: 1000, skipBlankLines: false, skipComments: false }],
    'no-restricted-syntax': [
      'error',
      {
        /**
         * @see https://palantir.github.io/tslint/rules/static-this/
         */
        selector: 'MethodDefinition[static = true] ThisExpression',
        message:
          "If you're calling a static method, you need to call it with the name of its " +
          "class instead of using 'this'. Static 'this' usage can be confusing for newcomers. " +
          "It can also become imprecise when used with extended classes when a static 'this' of a " +
          'parent class no longer specifically refers to the parent class.'
      }
    ],
    '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          object:
            'The `Object` type actually means "any non-nullish value", so it is marginally better than `unknown`.' +
            'If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.' +
            'If you want a type meaning "any value", you probably want `unknown` instead.',
          '{}': false
        },
        extendDefaults: true
      }
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
          //message: 'Interface names must not start with "I".'
        }
      },
      {
        selector: ['method'],
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        custom: {
          regex: '^edit|return[A-Z]',
          match: false,
          /*message:
            'Method names must not start with "edit". Use "update" instead.' +
            'Method names must not start with "return". Use "get" instead.'*/
        }
      },
      {
        selector: 'class',
        format: ['PascalCase'],
        custom: {
          regex: '[A-Z]*Args',
          match: false,
          //message: 'Class names must not end with "Args". Use "Input" instead.'
        }
      }
    ]
  },
  overrides: [
    {
      files: ['*.entity.ts'],
      rules: {
        'max-lines': 'off',
        'no-restricted-imports': [
          'error',
          {
            name: '@nestjs/graphql',
            importNames: ['ObjectType'],
            message:
              'The @ObjectType annotation must only be used in DTOs, not in database entities.'
          }
        ]
      }
    },
    {
      files: ['*.service.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            name: 'graphql',
            importNames: ['GraphQLResolveInfo'],
            message:
              'Use GraphQLResolveInfo only in *.resolver.ts files. Do not import it in other files.'
          }
        ]
      }
    },
    {
      files: ['*.resolver.ts'],
      rules: {
        'max-params-no-constructor/max-params-no-constructor': ['error', 5]
      }
    }
  ]
};
