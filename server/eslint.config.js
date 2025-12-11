export default [
  {
    files: ['**/*.js'], // apply to all JS files
    rules: {
      semi: 'error', // force semicolons
      'no-unused-vars': 'warn', //warn for unused variables
    },
  },
];
