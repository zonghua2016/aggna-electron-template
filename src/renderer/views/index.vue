<!--
 * @Author       : tongzonghua
 * @Date         : 2020-10-20 23:19:42
 * @LastEditors  : tongzonghua
 * @LastEditTime : 2020-10-21 02:58:59
 * @Email        : tongzonghua@360.cn
 * @Description  : 
 * @FilePath     : /cli/aggna-electron-template/src/renderer/views/index.vue
-->
<template>
  <div class="main">
    <div class="main_page">
      <Content />
    </div>
  </div>
</template>
<script>
import Content from "@/components/Content";
export default {
  name: "Index",
  components: {
    Content
  }
};
</script>
<style lang="less" scoped>
</style>