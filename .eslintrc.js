module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    mocha: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: [
    "mocha"
  ],
  rules: {
    indent: ["error", 4],
    "prefer-arrow-callback": 0,
    "mocha/prefer-arrow-callback": 2,
    "no-unused-vars": [
      "error",
      {
        "varsIgnorePattern": "should|expect"
      }
    ],
    "func-names": "off",
    "no-console": "off"
  },
};
