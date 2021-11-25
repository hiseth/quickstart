<!--
 * @Author: Seth
 * @Email: withseth@foxmail.com
 * @Date: 2021-11-09 09:02:46
 * @Description:
-->
<template>
  <div>
      资产列表页
    <el-card class="box-card">
      <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>资产管理</el-breadcrumb-item>
        <el-breadcrumb-item>资产列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 搜索+添加资产 -->
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
          <el-button type="primary" @click="addCisDialogVisible = true"
            >添加资产
          </el-button>
        </el-col>
      </el-row>

      <el-table :data="CiList" style="width: 100%">
        <el-table-column type="index" label="序号" width="180">
        </el-table-column>
        <el-table-column prop="fields.value" label="名称"> </el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="{ row }">
            <el-button size="mini" @click="handleEditCis(row)">编辑</el-button>
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

      <!-- 添加资产对话框 -->
      <el-dialog
      title="添加资产"
      :visible.sync="addCisDialogVisible"
      @close="resetCisForm('addCis')"
    >
      <el-form
        :model="addCisForm"
        :rules="addCisRules"
        ref="addCis"
        label-width="100px"
      >
      <!-- 资产类型选择框 -->
        <el-form-item label="资产类型" prop="citype">
          <el-select v-model="addCisForm.citype" placeholder="请选择" @change="handleChangeCis">
            <el-option
              v-for="item in citypes"
              :key="item.id"
              :label="item.label + ':v' + item.version"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 动态增加表单项 -->
        <!-- :rules 三元表达式判断如果required为false则不需要校验规则 -->
         <el-form-item
          v-for="(domain, index) in addCisForm.fields"
          :label="domain.label"
          :key="domain.key"
          :prop="'fields.' + index + '.value'"
          :rules="domain.required ?
            {required: true, message: '域名不能为空', trigger: 'blur'}
            : {}
            "
        >
        <!-- 判断日期、列表不同类型 生成不同的输入框或者显示其他 -->
          <div v-if="domain.type.startsWith('list:') === true">
            <el-button size="mini" type="success" icon="el-icon-plus" @click="handleSubType(domain)"></el-button>
            <!-- 动态子表单 -->
            <el-card v-for="(subdomain, i) in domain.children"
              :key="subdomain.name + i"
            >
            <!-- <div>{{ subdomain }}</div> -->
              <el-form-item
                v-for="(f, j) in subdomain"
                :label="f.label"
                :key="f.name + j"
                :prop="'fields.' + index + '.children.' + i + '.' + j + '.value'"
                :rules="f.required ?
                  {required: true, message: '必填项不能为空', trigger: 'blur'}
                  : {}
                  "
              >
                <el-input v-model="f.value"></el-input>
              </el-form-item>
            </el-card>

          </div>
          <div v-else><el-input v-model="domain.value"></el-input></div>
        </el-form-item>

        <!-- <el-form-item label="名称" prop="name">
          <el-input v-model="addCisForm.name"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCisDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCis">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 授权 -->
    <!-- <el-dialog
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
    </el-dialog> -->
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCiList();
    this.getCiTypeList();
  },
  data() {
    return {
      pagination: { page: 1, size: 2, total: 0 },
      CiList: [],
      search: "",
      setRoleDialogVisible: false,
      // setRoleForm: {
      //   name: "",
      // },
      permsdata: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selectedIds: [],
      currentRow: {},
      // 添加资产
      citypes: [],
      addCisDialogVisible: false,
      addCisForm: {
        name: '',
        citype: null,
        fields: []
      },
      addCisRules: {
        citype: [
          { required: true, message: "请选择资产类型", trigger: "blur" }
        ],
      },
    }
  },
  methods: {
    async handleSubType(domain) {
      console.log('handleSubType');
      const [, name, version] = domain.type.split(':')
      const { data: response } = await this.$http.get(`cmdb/citypes/${name}/${version}/`);
      if (response.code) {
        return this.$message.error(response.message);
      }
      if (!('children' in domain)) {
        this.$set(domain, 'children', [])
      }
      domain.children.push(response.fields)

      // this.$set(domain, 'children', response.fields) // 响应式渲染 https://cn.vuejs.org/v2/api/#vm-set
      console.log(this.addCisForm);
    },
    async handleChangeCis() {
      console.log("选择资产");
      const { citype: id } = this.addCisForm
      const { data: response } = await this.$http.get(`cmdb/citypes/${id}/`);
      if (response.code) {
        return this.$message.error(response.message);
      }
      console.log(response);
      this.addCisForm.fields = response.fields
    },
    // 重置资产选择
    resetCisForm(name) {
      console.log('取消添加资产~~~~');
      this.$refs[name].resetFields()
      this.addCisForm = { citype: null, fields: [] }
    },
    addCis() {
      console.log(this.addCisForm);
      const name = 'addCis'
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          const { data: response } = await this.$http.post('cmdb/cis/', this.addCisForm)
          if (response.code) {
            return this.$message.error(response.error)
          }
          this.addCisDialogVisible = false
          this.$message({ message: "资产添加成功", type: "success" })
          this.getCiList()
        }
      })
    },
    // 获取所有资产
    async getCiList(page = 1) {
      if (!page) {
        page = 1;
      }
      const { data: response } = await this.$http.get("cmdb/cis/", {
      });
      if (response.code) {
        return this.$message.error(response.message);
      }
      console.log(response);

      this.CiList = response.results;
      console.log('获取新添加的服务器~~~~~~~~~~~`');
      console.log(response.results);
      // this.pagination = response.pagination;
    },
    // 获取资产类型
    async getCiTypeList(page = 1) {
      if (!page) {
        page = 1;
      }
      const { data: response } = await this.$http.get("cmdb/citypes/all/", {
      });
      if (response.code) {
        return this.$message.error(response.message);
      }
      console.log(response);
      this.citypes = response
      // this.pagination = response.pagination;
    },
    // 设置权限
    // async setRole(row) {
    //   console.log('设置权限');
    //   console.log(this.$refs.tree.getCheckedKeys());
    //   const { id } = this.currentRow
    //   const permissions = this.$refs.tree.getCheckedKeys()
    //   const { data: response } = await this.$http.patch(`users/roles/${id}/`, {
    //     permissions
    //   }
    //   )
    //   if (response.code) {
    //     return this.$message.error(response.error)
    //   }
    //   console.log(response);
    //   this.setRoleDialogVisible = false
    // },
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
}
</script>

<style lang="less" scoped>
 .el-form-item .el-card .el-form-item {
   margin-bottom: 22px;
 }
</style>