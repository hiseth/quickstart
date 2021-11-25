/*
 * @Author: Seth
 * @Email: withseth@foxmail.com
 * @Date: 2021-10-16 14:50:27
 * @Description:
 */

const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push("transform-remove-console")
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    ...prodPlugins
  ]
}
