<!--
 * @Author: Seth
 * @Email: seth.qiang@gmail.com
 * @Date: 2021-09-29 22:54:41
 * @Description:
-->

<template>
  <div>
    角色列表页
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="Search..." v-model="search">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getRoleList(1)"
            ></el-button
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addRoleDialogVisible = true"
            >添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolelist" style="width: 100%">
        <el-table-column type="index" label="序号" width="180">
        </el-table-column>
        <el-table-column prop="name" label="角色名"> </el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="{ row }">
            <el-button size="mini" @click="handleEditPerm(row)">授权</el-button>
            <el-button size="mini" @click="handleEditRole(row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pagination.page"
        :page-size="pagination.size"
        layout="total, prev, pager, next, jumper"
        :total="pagination.total"
      >
      </el-pagination>
      <!-- 添加角色 -->
      <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      @close="restForm"
    >
      <el-form
        :model="addRoleForm"
        :rules="addRoleRules"
        ref="addRole"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 授权 -->
    <el-dialog
      :title="currentRow.name + '角色分配权限'"
      :visible.sync="setRoleDialogVisible"
      @close="resetRoleForm"
    >
      <el-card>
          <el-tree
            ref="tree"
            :data="permsdata"
            show-checkbox
            node-key="id"
            :default-checked-keys="selectedIds"
            :props="defaultProps">
          </el-tree>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </div>
    </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleList();
  },
  data() {
    return {
      pagination: { page: 1, size: 2, total: 0 },
      rolelist: [],
      search: "",
      setRoleDialogVisible: false,
      setRoleForm: {
        name: "",
      },
      // 授权
      permsdata: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selectedIds: [],
      currentRow: {},
      // 添加角色
      addRoleDialogVisible: false,
      addRoleForm: {
        name: "",
      },
      addRoleRules: {
        name: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          {
            min: 1,
            max: 16,
            message: "长度在 1 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    }
  },
  methods: {
    handleEditRole(row) {
      this.editRoleForm = row;
      this.editRoleDialogVisible = true;
    },
    // // 删除角色
    // handleDelete(row) {
    //   this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(async () => {
    //       const { id } = row;
    //       const { data: response } = await this.$http.delete(`users/mgr/${id}/`);
    //       if (response.code) {
    //         return this.$message.error(response.message);
    //       }
    //       this.getRoleList(this.pagination.page);
    //       this.$message({
    //         type: "success",
    //         message: "删除成功!",
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除",
    //       });
    //     });
    // },
    // 修改用户
    // editrestForm() {
    //   console.log("edit user ~~~~~~~~~");
    //   const name = "editRole";
    //   this.$refs[name].resetFields();
    // },
    // editRole() {
    //   const { id } = this.editRoleForm;
    //   const name = "editRole";
    //   this.$refs[name].validate(async (valid) => {
    //     if (valid) {
    //       const { data: response } = await this.$http.patch(
    //         `users/mgr/${id}/`,
    //         this.editRoleForm
    //       );
    //       if (response.code) {
    //         return this.$message.error(response.message);
    //       }
    //       this.editRoleDialogVisible = false;
    //       this.$message({ message: "用户修改成功", type: "success" });
    //       this.editrestForm(name);
    //       this.getRoleList(this.pagination.page); // 修改后刷新当前页
    //     }
    //   });
    // },

    // 角色授权
    resetRoleForm() {
      console.log('取消角色授权~~~~');
      this.permsdata = []
      this.$refs.tree.getCheckedKeys([])
      this.currentRow = {}
    },
    restForm() {
      const name = 'addRole'
      this.$refs[name].resetFields()
    },
    addRole() {
      const name = "addRole"
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          const { data: response } = await this.$http.post(
            "users/roles/",
            this.addRoleForm
          )
          if (response.code) {
            return this.$message.error(response.error)
          }
          this.addRoleDialogVisible = false
          this.$message({ message: "角色添加成功", type: "success" })
          this.getRoleList()
        }
      })
    },
    // 获取角色
    async getRoleList(page = 1) {
      if (!page) {
        page = 1;
      }
      const { data: response } = await this.$http.get("users/roles/", {
        params: {
          page,
          username: this.search,
        },
      });
      if (response.code) {
        return this.$message.error(response.message);
      }
      console.log(response);

      this.rolelist = response.results;
      this.pagination = response.pagination;
    },
    // 设置权限
    async setRole(row) {
      console.log('设置权限');
      console.log(this.$refs.tree.getCheckedKeys());
      const { id } = this.currentRow
      const permissions = this.$refs.tree.getCheckedKeys()
      const { data: response } = await this.$http.patch(`users/roles/${id}/`, {
        permissions
      }
      )
      if (response.code) {
        return this.$message.error(response.error)
      }
      console.log(response);
      this.setRoleDialogVisible = false
    },
    // 编辑权限
    async handleEditPerm(row) {
      const { id } = row
      console.log(row);
      const { data: response } = await this.$http.get(`users/roles/${id}/perms/`);
      if (response.code) {
        return this.$message.error(response.message);
      }
      console.log(response);
      this.permsdata = response.allPerms;
      this.selectedIds = response.permissions
      this.currentRow = response
      this.setRoleDialogVisible = true
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getPermList(val);
    },
  },
};
</script>

<style lang="less" scoped>
</style>
