/*
 * @Author: Seth
 * @Email: seth.qiang@gmail.com
 * @Date: 2021-09-25 10:14:24
 * @Description:
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Test from '../components/Test.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Roles from '../components/user/Roles.vue'
import Perms from '../components/user/Perms.vue'
import CiType from '../components/cmdb/Citypes.vue'
import Ci from '../components/cmdb/Cis.vue'
import Org from '../components/jumps/Organization.vue'
import Webshell from '../components/jumps/Webshell.vue'
import Dashboard from '../components/jumps/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/test', component: Test },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/users/roles/', component: Roles },
      { path: '/users/perms/', component: Perms },
      { path: '/cmdb/citypes/', component: CiType },
      { path: '/cmdb/cis/', component: Ci },
      { path: '/jumps/orgs/', component: Org },
      { path: '/jumps/webshell/:id', component: Webshell }, // 动态路由传参
      { path: '/jumps/dashboard/', component: Dashboard },
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // console.log(to);
  // console.log(from);
  if (to.path !== '/login') {
    const token = window.localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
