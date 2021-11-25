<!--
 * @Author: Seth
 * @Email: withseth@foxmail.com
 * @Date: 2021-11-20 17:54:36
 * @Description:
-->

<template>
  <div>
    仪表盘页面
    <el-card>
      <p id="graph"></p>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  mounted() {
    this.getInfo()
  },
  data() {

  },
  methods: {
    async getInfo() {
      const { data: response } = await this.$http.get("jumps/dashboard/")
      if (response.code) {
        return this.$message.error(response.error)
      }

      const option = JSON.parse(response)
      const chart1 = echarts.init(document.getElementById('graph'));
      console.log('option1~~~~~~~', option);

      // const option = {
      //   xAxis: {
      //     type: 'category',
      //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      //   },
      //   yAxis: {
      //     // type: 'value'
      //   },
      //   series: [
      //     {
      //       data: [150, 230, 224, 218, 135, 147, 260],
      //       type: 'line'
      //     }
      //   ]
      // };
      chart1.setOption(option);
    }
  }
}
</script>

<style lang="less" scoped>
#graph {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>
