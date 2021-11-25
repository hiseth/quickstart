<!--
 * @Author: Seth
 * @Email: withseth@foxmail.com
 * @Date: 2021-10-12 09:21:57
 * @Description:
-->
<template>
  <div>
    权限列表页
    <el-card class="box-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
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
      </el-row>
      <el-table :data="permlist" style="width: 100%">
        <el-table-column type="index" label="序号" width="180">
        </el-table-column>
        <el-table-column prop="name" label="Permission Name"> </el-table-column>
        <el-table-column prop="codename" label="Code Name"></el-table-column>
        <el-table-column prop="content_type.app_label" label="Application"></el-table-column>
        <el-table-column prop="content_type.model" label="Model"></el-table-column>
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
  </div>
</template>

<script>
export default {
  created() {
    this.getPermList();
  },
  data() {
    return {
      pagination: { page: 1, size: 2, total: 0 },
      permlist: [],
      search: "",
    };
  },
  methods: {
    async getPermList(page = 1) {
      if (!page) {
        page = 1;
      }
      const { data: response } = await this.$http.get("users/perms/", {
        params: {
          page,
          username: this.search,
        },
      });
      if (response.code) {
        return this.$message.error(response.message);
      }
      console.log(response);

      this.permlist = response.results;
      this.pagination = response.pagination;
    },
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
