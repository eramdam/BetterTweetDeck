/**
 * ESLint conf inspired by Airnb's ES6 configuration + some basic stuff
 */
module.exports = {
  'parser': 'babel-eslint',
  'env': {
    'es6': false,
    'node': true,
    'jquery': true,
    'browser': true
  },
  'globals': {
    'chrome': false,
    'TD': false,
  },
  'ecmaFeatures': {
    'arrowFunctions': true,
    'blockBindings': true,
    'classes': true,
    'defaultParams': true,
    'destructuring': true,
    'forOf': true,
    'generators': false,
    'modules': true,
    'objectLiteralComputedProperties': true,
    'objectLiteralDuplicateProperties': false,
    'objectLiteralShorthandMethods': true,
    'objectLiteralShorthandProperties': true,
    'spread': true,
    'superInFunctions': true,
    'templateStrings': true
  },
  'rules': {
    /**
     * POSSIBLE ERRORS
     * See http://eslint.org/docs/rules/#possible-errors
     */
    'comma-dangle': [2, "never"],
    'no-constant-condition': 2,
    'no-control-regex': 2,
    'no-dupe-args': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-empty': 1,
    'no-empty-character-class': 2,
    'no-ex-assign': 2,
    'no-extra-boolean-cast': 2,
    'no-extra-parens': [2, 'all'],
    'no-extra-semi': 2,
    'no-func-assign': 2,
    'no-inner-declarations': 2,
    'no-invalid-regexp': 2,
    'no-irregular-whitespace': 2,
    'no-negated-in-lhs': 2,
    'no-obj-calls': 2,
    'no-regex-spaces': 2,
    'no-sparse-arrays': 2,
    'no-unexpected-multiline': 2,
    'no-unreachable': 1,
    'use-isnan': 2,
    'valid-typeof': 2,

    /**
     * BEST PRACTICES
     * See http://eslint.org/docs/rules/
     */
    'curly': [2, 'multi', 'consistent'],
    'dot-location': [2, 'property'],
    'dot-notation': 2,
    'eqeqeq': 2,
    'no-alert': 2,
    'no-caller': 2,
    'no-case-declarations': 2,
    'no-div-regex': 2,
    'no-else-return': 2,
    'no-eq-null': 2,
    'no-empty-pattern': 2,
    'no-eval': 2,
    'no-extend-native': 2,
    'no-extra-bind': 2,
    'no-new': 2,
    'no-redeclare': 2,

    /**
     * STYLE RELATED
     */
    'array-bracket-spacing': 2,
    'block-spacing': 2,
    'brace-style': [2, '1tbs', {'allowSingleLine': true}],
    'indent': [2, 2, {'VariableDeclarator': 2, 'SwitchCase': 1}],
    'new-cap': 2,
    'no-trailing-spaces': 2,
    'no-undef': 2,
    'no-unused-vars': 2,
    'object-curly-spacing': [2, 'always'],
    'quotes': [2, 'single'],
    'semi': 2,
    'semi-spacing': 2,
    'space-after-keywords': 2,
    'space-before-blocks': 2,
    'space-before-function-paren': [2, {'anonymous': 'always', 'named': 'never'}],
    'space-before-keywords': 2,
    'space-in-parens': 2,
    'space-infix-ops': 2,
    'space-return-throw-case': 2,
    'space-unary-ops': 2,
    'spaced-comment': [2, 'always'],

    /**
     * ES6 RELATED RULES
     */
    // require parens in arrow function arguments
    'arrow-parens': 0,
    // require space before/after arrow function's arrow
    'arrow-spacing': 0,
    // verify super() callings in constructors
    'constructor-super': 0,
    // enforce the spacing around the * in generator functions
    'generator-star-spacing': 0,
    // disallow modifying variables of class declarations
    'no-class-assign': 0,
    // disallow modifying variables that are declared using const
    'no-const-assign': 2,
    // disallow to use this/super before super() calling in constructors.
    'no-this-before-super': 0,
    // require let or const instead of var
    'no-var': 2,
    // require method and property shorthand syntax for object literals
    'object-shorthand': 0,
    // suggest using of const declaration for variables that are never modified after declared
    'prefer-const': 2,
    // suggest using the spread operator instead of .apply()
    'prefer-spread': 0,
    // suggest using Reflect methods where applicable
    'prefer-reflect': 0,
    // disallow generator functions that do not have yield
    'require-yield': 0
  }
};