module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
		sourceType: 'module',
		ecmaVersion: 2021,
	},
	plugins: ['@typescript-eslint', 'eslint-plugin-n8n-nodes-base'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier',
	],
	env: {
		node: true,
		es2021: true,
	},
	ignorePatterns: ['dist/**/*', 'node_modules/**/*', '*.js', 'gulpfile.js', 'jest.config.js', 'test/**/*'],
	rules: {
		// TypeScript specific rules - relaxed for n8n node development
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off', // n8n-workflow uses any extensively
		'@typescript-eslint/no-non-null-assertion': 'warn',
		'@typescript-eslint/no-floating-promises': 'error',
		'@typescript-eslint/await-thenable': 'error',
		'@typescript-eslint/no-misused-promises': 'error',
		'@typescript-eslint/require-await': 'off', // Many n8n methods may not need await
		'@typescript-eslint/no-unsafe-assignment': 'off', // n8n execution context returns any
		'@typescript-eslint/no-unsafe-member-access': 'off', // Needed for n8n data access
		'@typescript-eslint/no-unsafe-call': 'off', // Needed for n8n helpers
		'@typescript-eslint/no-unsafe-argument': 'off', // Needed for n8n API calls
		'@typescript-eslint/no-unnecessary-type-assertion': 'off', // Allow explicit typing

		// General rules
		'no-console': ['warn', { allow: ['warn', 'error'] }],
		'no-debugger': 'error',
		'no-duplicate-imports': 'off', // Allow separate type imports
		'no-unused-expressions': 'error',
		'prefer-const': 'error',
		'eqeqeq': ['error', 'always'],
		'curly': 'off', // Allow single-line if statements

		// n8n specific rules
		'n8n-nodes-base/node-class-description-credentials-name-unsuffixed': 'error',
		'n8n-nodes-base/node-class-description-display-name-unsuffixed-trigger-node': 'off',
		'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'off',
		'n8n-nodes-base/node-class-description-outputs-wrong': 'off',
		'n8n-nodes-base/node-execute-block-missing-continue-on-fail': 'warn',
		'n8n-nodes-base/node-param-default-wrong-for-boolean': 'error',
		'n8n-nodes-base/node-param-default-wrong-for-collection': 'error',
		'n8n-nodes-base/node-param-default-wrong-for-fixed-collection': 'error',
		'n8n-nodes-base/node-param-default-wrong-for-multi-options': 'error',
		'n8n-nodes-base/node-param-default-wrong-for-number': 'error',
		'n8n-nodes-base/node-param-default-wrong-for-options': 'error',
		'n8n-nodes-base/node-param-default-wrong-for-string': 'error',
		'n8n-nodes-base/node-param-description-boolean-without-whether': 'warn',
		'n8n-nodes-base/node-param-description-empty-string': 'error',
		'n8n-nodes-base/node-param-description-excess-final-period': 'warn',
		'n8n-nodes-base/node-param-description-lowercase-first-char': 'warn',
		'n8n-nodes-base/node-param-description-missing-final-period': 'warn',
		'n8n-nodes-base/node-param-description-missing-for-ignore-ssl-issues': 'error',
		'n8n-nodes-base/node-param-description-missing-for-return-all': 'error',
		'n8n-nodes-base/node-param-description-missing-for-simplify': 'error',
		'n8n-nodes-base/node-param-description-missing-from-dynamic-options': 'error',
		'n8n-nodes-base/node-param-description-missing-from-limit': 'error',
		'n8n-nodes-base/node-param-description-wrong-for-dynamic-options': 'error',
		'n8n-nodes-base/node-param-description-wrong-for-ignore-ssl-issues': 'error',
		'n8n-nodes-base/node-param-description-wrong-for-limit': 'error',
		'n8n-nodes-base/node-param-description-wrong-for-return-all': 'error',
		'n8n-nodes-base/node-param-description-wrong-for-simplify': 'error',
		'n8n-nodes-base/node-param-description-wrong-for-upsert': 'error',
		'n8n-nodes-base/node-param-display-name-excess-inner-whitespace': 'error',
		'n8n-nodes-base/node-param-display-name-miscased-id': 'error',
		'n8n-nodes-base/node-param-display-name-miscased': 'warn',
		'n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options': 'warn',
		'n8n-nodes-base/node-param-display-name-wrong-for-simplify': 'error',
		'n8n-nodes-base/node-param-display-name-wrong-for-update-fields': 'error',
		'n8n-nodes-base/node-param-option-description-identical-to-name': 'warn',
		'n8n-nodes-base/node-param-option-name-containing-star': 'error',
		'n8n-nodes-base/node-param-option-name-duplicate': 'error',
		'n8n-nodes-base/node-param-option-name-wrong-for-get-many': 'error',
		'n8n-nodes-base/node-param-option-name-wrong-for-upsert': 'error',
		'n8n-nodes-base/node-param-option-value-duplicate': 'error',
		'n8n-nodes-base/node-param-options-type-unsorted-items': 'off',
		'n8n-nodes-base/node-param-placeholder-miscased-id': 'error',
		'n8n-nodes-base/node-param-required-false': 'error',
		'n8n-nodes-base/node-param-resource-with-plural-option': 'error',
		'n8n-nodes-base/node-param-resource-without-no-data-expression': 'error',
		'n8n-nodes-base/node-param-type-options-missing-from-limit': 'error',
	},
	overrides: [
		{
			files: ['**/*.test.ts'],
			env: {
				jest: true,
			},
			rules: {
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/no-unsafe-assignment': 'off',
				'@typescript-eslint/no-unsafe-member-access': 'off',
				'@typescript-eslint/no-unsafe-call': 'off',
			},
		},
	],
};
