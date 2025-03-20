<script setup>
// import { onMounted, ref, reactive, toRefs } from "vue"
// https://blog.csdn.net/qq_45897239/article/details/136080318
import { onMounted, ref } from "vue";


onMounted(() => {

});
</script>

<template>
  <div class="experiment-page">
    <div class="experiment-container">
      <!-- PDF展示区 -->
      <div class="pdf-viewer">
        
      </div>
    </div>
  </div>
</template>

<style scoped>
.experiment-page {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 rounded-md;
}
.experiment-container {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-1 rounded-md;
}
</style>
