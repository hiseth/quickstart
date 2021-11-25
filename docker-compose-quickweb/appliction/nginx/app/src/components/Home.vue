<!--
 * @Author: Seth
 * @Email: seth.qiang@gmail.com
 * @Date: 2021-09-27 13:21:05
 * @Description:
-->
<template>
  <el-container>
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt="logo" />
        <div class="title">梦马运维管理系统</div>
        <div>
          <i
            :class="isCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
            @click="toogleMenu"
          ></i>
        </div>
      </div>
      <div class="info">
       <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              用户名：{{ user.username }} <i class="el-icon-arrow-down el-icon--right"></i> <!-- {{ user.username }} -->
            </span>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item command="persinfo" >个人资料</el-dropdown-item>
              <el-dropdown-item command="chapwd">修改密码</el-dropdown-item>
              <el-dropdown-item disabled></el-dropdown-item>
              <el-dropdown-item divided command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <!-- 修改密码 -->
        <el-dialog
          title="修改密码"
          :visible.sync="chaPwdDialogVisible"
          @close="chaPwdrestForm"
        >
          <el-form
            :model="chaPwdUserForm"
            :rules="chaPwdUserRules"
            ref="chaPwdUser"
            label-width="100px"
          >
            <el-form-item label="用户名:" prop="username"
              >{{ user.username }} {{ user.id }}
              <!-- <el-input v-model="chaPwdUserForm.username"></el-input> -->
            </el-form-item>
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input v-model="chaPwdUserForm.oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="chaPwdUserForm.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="checkNewpass">
              <el-input v-model="chaPwdUserForm.checkNewpass"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="chaPwdDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="chaPwdUser">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapsed ? '64px' : '200px'">
        <el-menu
          background-color="#123"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapsed"
          :collapse-transition="false"
          :router="true"
        >
          <el-submenu
            v-for="item in menulist"
            :key="item.id"
            :index="item.id + ''"
          >
            <template slot="title"
              ><i class="el-icon-user"></i
              ><span slot="title">{{ item.itemName }}</span></template
            >
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="subItem.path"
              ><i class="el-icon-message"></i
              ><span>{{ subItem.itemName }}</span></el-menu-item
            >
          </el-submenu>
          <el-menu-item index="1-4" @click="getmenulist">
            <i class="el-icon-info"></i
            ><span slot="title">查看菜单返回数据</span></el-menu-item>
          <el-menu-item index="t1"
            ><i class="el-icon-delete"></i
            ><span slot="title">退出</span></el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>Main <router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getmenulist();
    this.getUserinfo()
  },
  data() {
    // 校验密码
    var validatePass = (rule, value, callback) => {
      if (value !== this.chaPwdUserForm.newPassword) {
        callback(new Error("两次密码输入不一致！"))
      } else {
        callback()
      }
    }
    return {
      // 修改密码
      chaPwdDialogVisible: false,
      chaPwdUserForm: {
        username: "",
        oldPassword: "",
        newPassword: "",
        checkNewpass: "",
      },
      chaPwdUserRules: {
        username: [],
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
          {
            min: 4,
            max: 16,
            message: "长度在 4 到 16 个字符",
            trigger: "blur",
          },
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 4,
            max: 16,
            message: "长度在 4 到 16 个字符",
            trigger: "blur",
          },
        ],
        checkNewpass: [
          { required: true, message: "请确认新密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
        ],
      },
      // 获取用户
      menulist: [],
      user: {},
      isCollapsed: false,
    };
  },
  methods: {
    // 修改密码
    chaPwdrestForm() {
      console.log('change password');
      const name = "chaPwdUser"
      this.$refs[name].resetFields()
    },
    chaPwdUser() {
      // const { id } = this.chaPwdUserForm
      const name = "chaPwdUser"
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          const { data: response } = await this.$http.post(
            `users/${this.user.id}/set_password/`,
            this.chaPwdUserForm
          )
          if (response.code) {
            return this.$message.error(response.message)
          }
          this.chapwdDialogVisible = false
          this.$message({ message: "密码修改成功", type: "success" })
          this.chaPwdrestForm(name)
          this.getUserinfo()
        }
      })
    },
    // 获取用户详情
    async getUserinfo() {
      const { data: response } = await this.$http.get('users/mgr/whoami/')
      if (response.code) {
        return this.$message.error(response.message)
      }
      // console.log(response.user);
      this.user = response.user
    },
    async getmenulist() {
      const { data: response } = await this.$http.get("users/menulist/");
      if (response.code) {
        return this.$message.error(response.message);
      }
      console.log(response.items);
      console.log(response);
      this.menulist = response.items;
    },
    // chapwd() {
    //   console.log('修改密码');
    // },
    logout() {
      window.localStorage.removeItem("token");
      this.$router.push("/login");
    },
    toogleMenu() {
      this.isCollapsed = !this.isCollapsed;
    },
    handleCommand(command) {
      if (command === "logout") {
        this.logout()
      } else if (command === "chapwd") {
        this.chaPwdDialogVisible = true
        this.chaPwdUser()
      }
    }
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  .logo {
    display: flex;
    img {
      width: 65px;
      border-radius: 20px;
    }
    .title {
      font-size: 45px;
      margin-left: 10px;
    }
    .el-icon-s-unfold,
    .el-icon-s-fold {
      font-size: 32px;
      margin-left: 10px;
    }
  }
}

.el-aside {
  background-color: #112233;
}
.el-main {
  background-color: #f0f2f5;
}

.el-menu {
  border-right: none;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}

</style>
