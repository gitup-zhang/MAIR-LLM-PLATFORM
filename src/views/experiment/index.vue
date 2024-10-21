<script setup lang="ts">
import { ref } from 'vue'
import StudyExperiment from '@/components/experiment/StudyExperiment.vue'
const userType = ref(1);
</script>

<template>
  <div class="experiment-page">
    <template v-if="userType === 1">
      <StudyExperiment />
    </template>
    <template v-if="userType === 2">
      教师和教务
    </template>
  </div>
</template>

<style scoped>
/* 整体页面设置 */
.experiment-page {
  width: 100%;
  height: 100%;
  @apply bg-light-50;
}
</style>
