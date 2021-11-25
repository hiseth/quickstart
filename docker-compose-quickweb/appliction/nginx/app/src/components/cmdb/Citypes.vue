<!--
 * @Author: Seth
 * @Email: withseth@foxmail.com
 * @Date: 2021-11-09 09:02:29
 * @Description:
-->
<template>
  <div>
    资产类型列表页
   <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>资产管理</el-breadcrumb-item>
        <el-breadcrumb-item>资产类型列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="Search..." v-model="search">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList(1)"
            ></el-button
          ></el-input>
        </el-col>
        <el-col :span="6"
          ><el-button type="primary" @click="addUserDialogVisible = true"
            >添加资产类型</el-button
          ></el-col
        >
      </el-row>
      <el-table :data="getCitypeList" style="width: 100%">
        <el-table-column type="index" label="序号" width="180"></el-table-column>
        <el-table-column prop="label" label="名称"> </el-table-column>
        <el-table-column prop="name" label="类型名"> </el-table-column>
        <el-table-column prop="version" label="版本"> </el-table-column>
        <el-table-column prop="" label="操作">
          <el-tooltip content="修改资产类型" placement="top">
              <el-button type="primary" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
          <el-tooltip content="删除资产类型" placement="top">
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pagination.page"
        :page-size="pagination.size"
        layout="total, prev, pager, next, jumper"
        :total="pagination.total"
      >
      </el-pagination>
    </el-card>
    <!-- 分配角色 -->
    <el-dialog
      :title="'为 '+ currentRow.username +' 分配角色'"
      :visible.sync="editRoleDialogVisible"
      @close="editRolerestForm"
    >
      <el-card>
        <el-tree
          ref="tree"
          :data="rolesdata"
          show-checkbox
          node-key="id"
          :default-checked-keys="selectedIds"
          :props="defaultProps">
        </el-tree>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editUserDialogVisible"
      @close="editrestForm"
    >
      <el-form
        :model="editUserForm"
        :rules="editUserRules"
        ref="editUser"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username"
          >{{ editUserForm.username }}
          <!-- <el-input v-model="editUserForm.username"></el-input> -->
        </el-form-item>
        <el-form-item label="名字" prop="first_name">
          <el-input v-model="editUserForm.first_name"></el-input>
        </el-form-item>
        <el-form-item label="姓氏" prop="last_name">
          <el-input v-model="editUserForm.last_name"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editUserForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      @close="restForm"
    >
      <el-form
        :model="addUserForm"
        :rules="addUserRules"
        ref="addUser"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpass">
          <el-input v-model="addUserForm.checkpass"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addUserForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCitypeList();
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value !== this.addUserForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      noEdit: false,
      noDel: false,
      pagination: { page: 1, size: 2, total: 0 },
      userlist: [],
      search: "",
      // 分配角色
      editRoleDialogVisible: false,
      rolesdata: [],
      defaultProps: {
        label: 'name'
      },
      selectedIds: [],
      currentRow: {},
      // 编辑用户
      editUserDialogVisible: false,
      editUserForm: {
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      },
      editUserRules: {},
      // 添加用户
      addUserDialogVisible: false,
      addUserForm: {
        username: "",
        password: "",
        checkpass: "",
        email: "",
        phone: "",
      },
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 4,
            max: 16,
            message: "长度在 4 到 16 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 4,
            max: 16,
            message: "长度在 4 到 16 个字符",
            trigger: "blur",
          },
        ],
        checkpass: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async handleIsActive(row) {
      await this.$http.patch(`users/mgr/${row.id}/`, { is_active: row.is_active }); // 避免带过多的数据，仅active
    },
    handleEditUser(row) {
      this.editUserForm = row;
      this.editUserDialogVisible = true;
    },
    // 分配角色
    editRolerestForm() {
      this.rolesdata = []
      this.$refs.tree.getCheckedKeys([])
      this.currentRow = {}
    },
    async editRole(row) {
      console.log('分配角色写入数据库');
      console.log(this.$refs.tree.getCheckedKeys());
      const { id } = this.currentRow
      const groupids = this.$refs.tree.getCheckedKeys()
      const { data: response } = await this.$http.put(`users/mgr/${id}/roles/`, { groupids })
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.editRoleDialogVisible = false
    },
    async handleEditRole(row) {
      console.log('分配角色获取当前已有角色');
      const { id } = row
      const { data: response } = await this.$http.get(`users/mgr/${id}/roles/`)
      if (response.code) {
        return this.$message.error(response.message)
      }
      this.rolesdata = response.allRoles
      this.selectedIds = response.roles
      this.currentRow = response
      this.editRoleDialogVisible = true
      console.log(response);
    },
    // 删除用户
    handleDelete(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { id } = row;
          const { data: response } = await this.$http.delete(`users/mgr/${id}/`);
          if (response.code) {
            return this.$message.error(response.message);
          }
          this.getUserList(this.pagination.page);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 修改用户
    editrestForm() {
      console.log("edit user ~~~~~~~~~");
      const name = "editUser";
      this.$refs[name].resetFields();
    },
    editUser() {
      const { id } = this.editUserForm;
      const name = "editUser";
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          const { data: response } = await this.$http.patch(
            `users/mgr/${id}/`,
            this.editUserForm
          );
          if (response.code) {
            return this.$message.error(response.message);
          }
          this.editUserDialogVisible = false;
          this.$message({ message: "用户修改成功", type: "success" });
          this.editrestForm(name);
          this.getUserList(this.pagination.page); // 修改后刷新当前页
        }
      });
    },
    // 添加用户
    restForm() {
      console.log("~~~~~~~~~");
      const name = "addUser";
      this.$refs[name].resetFields();
    },
    addUser() {
      const name = "addUser";
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          const { data: response } = await this.$http.post(
            "users/mgr/",
            this.addUserForm
          );
          if (response.code) {
            return this.$message.error(response.message);
          }
          this.addUserDialogVisible = false;
          this.$message({ message: "用户添加成功", type: "success" });
          this.getUserList(); // 注册后刷新列表
        }
      });
    },
    // 请求用户列表
    async getCitypeList(page = 1) {
      if (!page) {
        page = 1;
      }
      const { data: response } = await this.$http.get("cmdb/citypes/", {
        params: {
          page,
        },
      });
      if (response.code) {
        return this.$message.error(response.message);
      }
      console.log(response);

      this.getCitypeList = response.results;
      this.pagination = response.pagination;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getUserList(val);
    },
  },
};
</script>

<style lang="less" scoped>
</style>