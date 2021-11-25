/*
 * @Author: Seth
 * @Email: seth.qiang@gmail.com
 * @Date: 2021-09-25 10:14:24
 * @Description:
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  // rules: {
  //   'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  //   'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  // }
  "rules": {
    'eol-last': 'off',
    'space-before-function-paren': 0,
    'quotes':0,
    'comma-dangle':0,
    'semi':0

  }
}
