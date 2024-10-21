<script setup lang="ts">
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()

</script>

<template>
  <div @click="systemStore.openExperimentDetailModal()" class="experiment-detail">
    <slot name="default"></slot>
  </div>

  <!-- 实验详情框 -->
  <el-dialog v-model="systemStore.experimentDetailVisible" title="实验详情" class="experimentDetailModal">
    111
  </el-dialog>
</template>

<style scoped>
.experiment-detail {
  display: inline-block;
}
.experimentDetailModal {

}
</style>
