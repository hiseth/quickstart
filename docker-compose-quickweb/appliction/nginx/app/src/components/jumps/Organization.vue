<!--
 * @Author: Seth
 * @Email: withseth@foxmail.com
 * @Date: 2021-11-13 12:03:24
 * @Description:
-->
<template>
  <div>
    树形组织结构页面
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>跳板机管理</el-breadcrumb-item>
        <el-breadcrumb-item>资产列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="Search..." v-model="search">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrgList(1)"
            ></el-button
          ></el-input>
        </el-col>
        <el-col :span="6"><el-button type="primary" @click="addOrgDialogVisible = true">增加分组</el-button>
        </el-col>
      </el-row>
      <el-card class="box-card">
        <el-tree
          ref="tree"
          :data="OrgList"
          node-key="id"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
          >
          <!-- 树形控件增删改查 -->
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-dropdown @command="handleCommand">
                <span  class="el-dropdown-link" ><i class="el-icon-setting" ></i></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-plus" :command="[1, data, node]" >增加分组</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-minus" :command="[2, data, node]" >删除分组</el-dropdown-item>
                  <el-dropdown-item v-if="data.id !== null"  icon="el-icon-plus" :command="[3, data, node]" divided >增加主机</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </span>
        </el-tree>
          <el-table :data="hostList" style="width: 100%">
            <el-table-column type="index" label="序号" width="180"></el-table-column>
            <el-table-column prop="ip" label="IP"> </el-table-column>
            <el-table-column prop="username" label="用户名"> </el-table-column>
            <el-table-column  label="操作">
              <template slot-scope="{ row }">
                <el-button size="mini" @click="handleWebshell(row)">远程登录</el-button>
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
      </el-card>

      <!-- 添加分组对话框 -->
      <el-dialog
        :title="'为 ' + `[${addOrgForm.parentName}]` + ' 添加子分组'"
        :visible.sync="addOrgDialogVisible"
        @close="restForm"
      >
        <el-form
          :model="addOrgForm"
          :rules="addOrgRules"
          ref="addOrg"
          label-width="100px"
        >
          <el-form-item label="分组名称" prop="name">
            <el-input v-model="addOrgForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addOrgDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOrg">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 添加主机对话框 -->
      <el-dialog
        :title="'为 ' + `[${addHostForm.orgName}]` + ' 分组' + ' 添加主机'"
        :visible.sync="addHostDialogVisible"
        @close="restHostForm"
      >
        <el-form
          :model="addHostForm"
          :rules="addHostRules"
          ref="addHost"
          label-width="100px"
        >
          <el-form-item label="IP" prop="ip">
            <el-input v-model="addHostForm.ip"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addHostForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addHostForm.password"></el-input>
          </el-form-item>
          <el-form-item label="密钥文件">
            <el-upload
              class="upload-demo"
              action="/api/v1/jumps/upload/"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :on-exceed="handleExceed"
              :limit="1"
              :file-list="fileList"
              :headers="getHeaders()"
              >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传id_rsa类型私钥文件，重复上传会被覆盖</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addHostDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addHost">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getOrgList();
    this.getHostList()
  },
  data() {
    var validatePassOrPkey = (rule, value, callback) => {
      if (value === '' && this.addHostForm.ssh_key_path === '') {
        callback(new Error("密码或密钥至少提交一个"))
      } else {
        callback()
      }
    }
    return {
      pagination: { page: 1, size: 2, total: 0 },
      search: "",
      // 添加分组
      addOrgDialogVisible: false,
      addOrgForm: {
        name: "",
        parent: null
      },
      addOrgRules: {
        name: [
          { required: true, message: "请输入分组名", trigger: "blur" },
          {
            min: 1,
            max: 16,
            message: "长度在 1 到 48 个字符",
            trigger: "blur",
          }
        ]
      },
      OrgList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 添加主机
      hostList: [],
      fileList: [],
      addHostDialogVisible: false,
      // uploadHeaders: { Authorization: `Bearer ${window.localStorage.getItem('token')}` },
      addHostForm: {
        ip: '',
        username: '',
        password: '',
        ssh_key_path: ''
      },
      addHostRules: {
        ip: [
          { required: true, message: "请输入被管理主机IP", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入主机名", trigger: "blur" },
          {
            min: 1,
            max: 16,
            message: "长度在 1 到 48 个字符",
            trigger: "blur",
          }
        ],
        password: [
          { validator: validatePassOrPkey, message: "请输入被管理主机登陆密码", trigger: "blur" }
        ]
      },

    }
  },
  methods: {
    restForm() {
      console.log('取消添加分组');
      const name = "addOrg"
      this.$refs[name].resetFields()
    },
    addOrg() {
      const name = "addOrg"
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          const { data: response } = await this.$http.post(
            "jumps/orgs/",
            this.addOrgForm
          )
          if (response.code) {
            return this.$message.error(response.error)
          }
          this.addOrgDialogVisible = false
          this.$message({ message: "分组添加成功", type: "success" })
          this.getOrgList()
        }
      })
    },
    delOrg(data) {
      const { id, name } = data
      console.log(id, name, '~~~~~');

      this.$confirm("此操作将永久删除该分组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const { id } = data
        const { data: response } = await this.$http.delete(`jumps/orgs/${id}/`)
        if (response.code) {
          return this.$message.error(response.message)
        }
        this.getOrgList()
        this.$message({
          type: "success",
          message: "删除成功",
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        })
      })
    },
    // 获取组织结构名称
    async getOrgList() {
      const { data: response } = await this.$http.get("jumps/orgs/tree/");
      if (response.code) {
        return this.$message.error(response.message);
      }
      // 增加根节点
      const tree = { id: null, name: '资产树', children: null }
      tree.children = response.results
      this.OrgList = [tree]
      // this.pagination = response.pagination;
      console.log(response);
      console.log(this.OrgList);
    },
    handleCommand(command) {
      // this.$message('click on item ' + command);
      console.log(command);
      const [i, data] = command
      if (i === 1) {
        console.log('增加分组');
        this.addOrgForm.parent = data.id
        this.addOrgForm.parentName = data.name
        this.addOrgDialogVisible = true
      } else if (i === 2) {
        console.log('删除分组');
        this.delOrg(data)
      } else if (i === 3) {
        console.log('增加主机');
        this.addHostForm.org = data.id
        this.addHostForm.orgName = data.name
        this.addHostDialogVisible = true
      }
    },
    // 添加主机
    restHostForm() {
      console.log('取消添加主机');
      const name = "addHost"
      this.$refs[name].resetFields()
    },
    addHost() {
      console.log('添加主机');
      console.log(this.addHostForm);
      console.log(this.addHostForm.length);
      this.addHostForm.ssh_key_path = this.fileList.length ? this.fileList[0].url : ''
      const name = "addHost"
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          const { data: response } = await this.$http.post(
            "jumps/hosts/",
            this.addHostForm
          )
          if (response.code) {
            return this.$message.error(response.error)
          }
          this.addHostDialogVisible = false
          this.$message({ message: "主机添加成功", type: "success" })
          this.restHostForm()
          this.getHostList(this.pagination.page, this.addHostForm.org)
        }
      })
    },
    async getHostList(page = 1, org) {
      if (!page) {
        page = 1
      }
      const { data: response } = await this.$http.get("jumps/hosts/", {
        params: {
          page,
          org
        }
      })
      if (response.code) {
        return this.$message.error(response.error)
      }
      console.log(response);
      this.hostList = response.results
      this.pagination = response.pagination
    },
    handleNodeClick(data) {
      console.log(data);
      console.log('你选中了' + `${data.name}`);
      const { id: org } = data
      this.getHostList(1, org)
    },
    getHeaders() {
      return { Authorization: `Bearer ${window.localStorage.getItem('token')}` }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList); // 移除的文件对象和移除后的文件列表
      this.fileList = []
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleSuccess(response, file, fileList) {
      console.log(response);
      console.log(file, fileList); // 上传成功后的文件对象和文件列表
      this.fileList = [response] // 只要response内容即可
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${ file.name }？`);
      console.log('beforeRemove');
      console.log(file, fileList);
    },
    // webshell
    handleWebshell(row) {
      console.log('远程连接');
      this.$router.push(`/jumps/webshell/${row.id}`)
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
}
</script>

<style lang="less" scoped>
  .el-tree {
    min-height: 300px;
    background-color: #fafafa;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
