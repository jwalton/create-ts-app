module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.json'],
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:import/recommended',
    ],
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        // typescript compiler has better unused variable checking.
        '@typescript-eslint/no-unused-vars': 'off',
        'import/no-unresolved': 'off',
        'import/named': 'off',
        'import/extensions': ['error', 'ignorePackages'],
        'eqeqeq': 'error',
    },
    overrides: [
        {
            files: ['src/**/*.ts', 'src/**/*.tsx'],
        },
        {
            files: ['src/**/*.spec.ts', 'src/**/*.spec.tsx'],
            rules: {
                '@typescript-eslint/no-non-null-assertion': 'off',
                '@typescript-eslint/no-object-literal-type-assertion': 'off',
            },
        },
    ],
};
