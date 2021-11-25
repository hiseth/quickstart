/*
 * @Author: Seth
 * @Email: seth.qiang@gmail.com
 * @Date: 2021-09-25 17:38:12
 * @Description:
 */

module.exports = {
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production',
      // 生产环境
      config => {

      },
      // 测试环境
      config => {
        config.devServer.proxy({
          '/api/v1': {
            target: 'http://127.0.0.1:8000',
            pathRewrite: { '^/api/v1': '' } // rewrite path
          }
        })
        // html-webpack
        config.plugin('html').tap(args => {
          console.log(args);
          return args
        })
      }
    )
  }
}