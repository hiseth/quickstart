<!--
 * @Author: Seth
 * @Email: seth.qiang@gmail.com
 * @Date: 2021-09-25 10:40:52
 * @Description:
-->

<template>
  <div id="app" class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="logo" />
        <!-- <p>Meng Ma</p> -->
      </div>
      <!-- 登录框组件 -->
      <el-form class="login_form" :model="loginForm" :rules="loginRules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-edit-outline"
            show-password
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="login" >登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 粒子

export default {

  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 50, message: '长度在 8 到 50 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // test () {
    //   console.log(this.loginForm.password, this.loginForm.username)
    // }
    // 登录名解构
    login() {
      // console.log(this);
      // const { username, password } = this.loginForm
      // console.log(username, password)
      const name = 'loginFormRef'
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          console.log('提交的是合法数据，正在验证登陆');
          const res = await this.$http.post('login/', this.loginForm)
          console.log(res);

          const { data: response } = res
          if (response.code) {
            return this.$message({ message: response.message, type: 'error' });
          }
          this.$message('登陆成功')
          this.$message({ message: '登陆成功', type: 'success' });
          console.log(response);
          window.localStorage.setItem('token', response.access)
          this.$router.push('/home')

          // console.log(response);
          // return console.log(response.message);
        }
      })
    },
    resetForm() {
      const name = 'loginFormRef'
      this.$refs[name].resetFields();
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #135561;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 270px;
  background-color: rgb(4, 30, 51);
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 140px;
    width: 140px;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 35%;
    }
    p {
      color: rgb(255, 0, 21);
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
  }
}
</style>
