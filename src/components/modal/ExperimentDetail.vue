<script setup lang="ts">
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()

</script>

<template>
  <div class="experiment-detail" @click="systemStore.openExperimentDetailModal()">
    <slot name="default"></slot>
  </div>


</template>

<style scoped>
.experiment-detail {
  display: inline-block;
  @apply mb-1;
}
.experimentDetailModal {

}
.chapter-list {
  width: 100%;
}
</style>
