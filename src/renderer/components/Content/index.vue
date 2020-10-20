<!--
 * @Author       : tongzonghua
 * @Date         : 2020-07-13 00:06:24
 * @LastEditors  : tongzonghua
 * @LastEditTime : 2020-10-21 03:01:10
 * @Email        : tongzonghua@360.cn
 * @Description  : 工作区
 * @FilePath     : /cli/aggna-electron-template/src/renderer/components/Content/index.vue
--> 
<template>
  <div class="content">
    <b>本案例提供了如下功能：</b>
    <ul>
      <li>1. 数据库存储方案</li>
      <li>2. 自动更新</li>
      <li>3. 开机自启动</li>
      <li>4. 托盘</li>
      <li>5. 注册快捷键</li>
      <li>6. 单例启动</li>
      <li>7. IPC 通信方法案例</li>
      <li>8. 日志收集</li>
      <li>9. 通用打包</li>
      <li>10. 封装 Electron 专用 Coolie 方法</li>
    </ul>
    <i>详见 main/index.js 文件</i>
    <p>---------------------------------</p>
    <p>直接在 renderer 中写 vue 代码即可</p>
  </div>
</template>
<script>
export default {
  name: "Content"
};
</script>

<style lang="less" scoped>
.content {
  padding: 20px;
  width: 100%;
}
</style>