/*
 * @Author: Seth
 * @Email: seth.qiang@gmail.com
 * @Date: 2021-09-25 10:14:24
 * @Description:
 */
import Vue from 'vue'
import App from './App.vue'
// import Login from './components/Login.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/main.css'
import axios from 'axios'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = "Bearer " + window.localStorage.getItem('token')
  return config
})

// 异常重置登陆
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  if (response.data.code && response.data.code <= 100) {
    router.push('/login')
  } else {
    return response;
  }
});

// axios base URL
axios.defaults.baseURL = '/api/v1/'
// 定义组件异步请求方法
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
