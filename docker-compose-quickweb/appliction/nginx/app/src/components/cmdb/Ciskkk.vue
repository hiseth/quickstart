<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资产管理</el-breadcrumb-item>
      <el-breadcrumb-item>资产列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="12"
          ><el-input placeholder="请输入内容" v-model="search">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true"
            >增加资产</el-button
          ></el-col
        >
      </el-row>

      <el-table :data="dataList" border style="width: 100%">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="label" label="名称"> </el-table-column>
        <el-table-column label="操作">
          <!-- <template #default="{ row }"> -->
          <el-tooltip content="分配权限" effect="light">
            <el-button type="info" icon="el-icon-plus" size="mini"></el-button>
          </el-tooltip>
          <el-tooltip content="修改" effect="light">
            <el-button
              type="successs"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除" effect="light">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </el-tooltip>
          <!-- </template> -->
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.page"
        :page-size="pagination.size"
        layout="total, prev, pager, next, jumper"
        :total="pagination.total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加资产对话框 -->
    <el-dialog
      title="增加资产"
      :visible.sync="addDialogVisible"
      @close="resetForm('add')"
    >
      <el-form :model="addForm" :rules="addRules" ref="add" label-width="100px">
        <el-form-item label="名称">
          <el-select
            v-model="addForm.citype"
            placeholder="请选择"
            @change="handleCiTypeChange"
          >
            <el-option
              v-for="item in citypes"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 动态表单项 -->
        <el-form-item
          v-for="(domain, index) in addForm.fields"
          :label="domain.label"
          :key="domain.name"
          :prop="'fields.' + index + '.value'"
          :rules="
            domain.required
              ? {
                  required: true,
                  message: domain.label + '不能为空',
                  trigger: 'blur'
                }
              : {}
          "
        >
          <div v-if="!domain.type.startsWith('list:')">
            <el-input v-model="domain.value"></el-input>
          </div>
          <div v-else>
            <el-button
              icon="el-icon-plus"
              size="mini"
              type="success"
              @click="handleAddChild(domain)"
            ></el-button>
            <el-card
              v-for="(def, i) in domain.fieldsDef"
              :key="`${domain.name}.def.${i}`"
            >
              <!-- <div>{{ def }}</div> -->
              <!-- 动态子表单项 -->
              <el-form-item
                v-for="(subDomain, j) in def.fields"
                :label="subDomain.label"
                :key="subDomain.name"
                :prop="
                  'fields.' +
                  index +
                  '.fieldsDef.' +
                  i +
                  '.fields.' +
                  j +
                  '.value'
                "
                :rules="
                  subDomain.required
                    ? {
                        required: true,
                        message: subDomain.label + '不能为空',
                        trigger: 'blur'
                      }
                    : {}
                "
              >
                <el-input v-model="subDomain.value"></el-input>
              </el-form-item>
            </el-card>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getList()
    this.getAllTypeList()
  },
  data() {
    return {
      search: '',
      dataList: [],
      pagination: { page: 1, size: 1, total: 0 },
      citypes: [],
      addDialogVisible: false,
      addForm: {
        citype: null,
        fields: []
      },
      addRules: {
        citype: [
          { required: true, message: '请选择资产类型', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm(formName) {
      console.log('~~~~~~~~~~~~~~~~~~~~')
      this.$refs[formName].resetFields()
      this.addForm = { citype: null, fields: [] }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(page) {
      console.log(`当前页: ${page}`)
      this.getList(page)
    },
    async getList(page = 1) {
      if (!page) {
        page = 1
      }
      const { data: response } = await this.$http.get('cmdb/cis/', {
        params: {
          page
        }
      })
      if (response.code) {
        return this.$message.error(response.message)
      }
      console.log(response)
      this.dataList = response.results
      this.pagination = response.pagination
    },
    async getAllTypeList(page = 1) {
      if (!page) {
        page = 1
      }
      const { data: response } = await this.$http.get('cmdb/citypes/all/')
      if (response.code) {
        return this.$message.error(response.message)
      }
      //   console.log(response)
      this.citypes = response
    },
    async handleCiTypeChange() {
      console.log(this.addForm) // 去请求类型的字段
      const { citype: id } = this.addForm
      const { data: response } = await this.$http.get(`cmdb/citypes/${id}/`)
      if (response.code) {
        return this.$message.error(response.message)
      }
      //   this.addForm.fields = response.fields
      this.$set(this.addForm, 'fields', response.fields) // 增加Reactive对象
      console.log(this.addForm) // 注释fields，观察注释前后并对比
      console.log(response) // 返回所有定义的字段
    },
    async handleAddChild(domain) {
      console.log(domain)
      console.log(domain.type.split(':'))
      const [, name, version] = domain.type.split(':')
      const { data: response } = await this.$http.get(
        `cmdb/citypes/${name}/${version}/`
      )
      if (response.code) {
        return this.$message.error(response.error)
      }
      if ('fieldsDef' in domain === false) {
        // domain.fieldsDef = [] // 这种新增方式无法触发视图更新
        this.$set(domain, 'fieldsDef', [])
      }
      domain.fieldsDef.push(response)
      console.log(domain.fieldsDef, '%%%%%%%%%')
    },
    add() {
      console.log(this.addForm)
      const name = 'add'
      console.log(name)
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          const { data: response } = await this.$http.post(
            'cmdb/cis/',
            this.addForm
          )
          console.log(response)
          if (response.code) {
            return this.$message.error(response.error)
          }
          this.addDialogVisible = false
          this.resetForm(name)
          this.getList()
          console.log('~~~~~肖金根');
        }
      })

      console.log(this.addForm)
    }
  }
}
</script>

<style>
</style>