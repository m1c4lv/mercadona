module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    'jest/globals': true
  },
  plugins: ['jest'],
  extends: [
    'standard',
    'plugin:jest/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  settings: {
    jest: {
      version: '8.43.0'
    }
  },
  rules: {
    // Reglas personalizadas, si las tienes
  }
}
