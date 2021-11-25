<!--
 * @Author: Seth
 * @Email: withseth@foxmail.com
 * @Date: 2021-11-20 09:20:54
 * @Description:
-->

<template>
  <div class="console">
    WebShell 登陆页面 <br>
    主机编号: {{ $route.params.id }}
    <br>
    <br>
    <br>
    <div class="output" v-for="(output, index) in outputList" :key="index" >
      {{ output[0] }}  <br> {{ output[1] }}
    </div>
    <hr>
    <div>
      <el-input v-model="command" placeholder="请输入内容" @keyup.native.enter="handleCommand"></el-input>
    </div>
  </div>
</template>

<script>

export default {
  created() {
    this.getHost()
  },
  data() {
    return {
      outputList: [],
      command: ''
    }
  },
  methods: {
    async getHost() {
      console.log(this.$route.params);
      const { id } = this.$route.params
      const { data: response } = await this.$http.get(`/jumps/hosts/${id}/`)
      if (response.code) {
        return this.$message.error(response.error)
      }
      console.log(response);
      const { ip, username } = response
      const line = `正在连接到${ip} 主机，登陆用户名：${username}`
      this.outputList.push(line)

      // 建立websocket连接
      if ('WebSocket' in window) {
        const ws = new WebSocket('ws://localhost:9999/webshell')
        ws.onopen = (event) => {
          this.outputList.push(`连接到${ip}:22 ....`)
          console.log(event);
          ws.send(
            JSON.stringify({
              token: window.localStorage.getItem('token'),
              hostID: id
            })
          )
        }
        ws.onmessage = (event) => {
          console.log('onmessage ~~~~~~~~~~~~~~', event);
          const outputs = JSON.parse(event.data) // 解析字符串
          console.log('outputs~~~~~~', outputs);
          this.outputList.push(outputs)
        }
        ws.onclose = (event) => {
          console.log('onclose ~~~~~~~·~~~~~', event);
          this.outputList.push(`主机: ${ip}连接已断开!`)
        }
        this.ws = ws // 定义全局给handleCommand使用
        ws.onerror = (event) => {
          console.log('onclose ~~~~~~~~~·', event);
          this.outputList.push(`主机: ${ip}连接异常!`)
        }
      } else {
        this.$message.error('当前浏览器不支持WebSocket功能，请更换浏览器或升级浏览器版本!')
      }
    },
    handleCommand() {
      console.log(`已获取到输入的命令: ${this.command}，下一步准备执行......`);
      this.ws.send(this.command) // 发送执行命令
    },
  }
}
</script>

<style lang="less" scoped>
.console {
  height: 100%;
  min-height: 300px;
  color: whitesmoke;
  background-color: black;
  padding: 5px;
}
</style>
