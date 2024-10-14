<script setup lang="ts">

</script>

<template>
  <div class="me-page">
    <el-row>
      <el-col :lg="18" class="left-main">
        <img src="../assets/img/banner.png" class="img-size" alt="">
      </el-col>
      <el-col :lg="6" class="sider-nav">
1
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
/* 整体页面设置 */
.me-page {
  width: 100%;
  height: 100%;
  @apply bg-light-50;
}
.left-main {
  width: 100%;
  height: 100%;
}
.img-size {
  width: 70%;
  height: 20%;
}
</style>
