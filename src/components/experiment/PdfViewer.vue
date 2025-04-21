<script setup lang="ts">
import { computed, onMounted} from 'vue'


import VuePdfApp from 'vue3-pdf-app'
import 'vue3-pdf-app/dist/icons/main.css'

interface Props {
  src: string | ArrayBuffer // pdf 地址
  width?: string | number // 预览容器宽度
  height?: string | number // 预览容器高度
  pageScale?: number | 'page-actual' | 'page-width' | 'page-height' | 'page-fit' | 'auto' // 页面默认缩放规则
  // pageNumber?: number // 默认展示第几页
  theme?: 'dark' | 'light' // 预览主题
  fileName?: string // 覆盖 pdf 文件名
}
const props = withDefaults(defineProps<Props>(), {
  src: '',
  width: '100%',
  height: '100%',
  pageScale: 'page-fit', // 默认自适应展示一页
  // pageNumber: 1,
  theme: 'dark',
  fileName: ''
})
const viewerWidth = computed(() => {
  if (typeof props.width === 'number') {
    return `${props.width}px`
  } else {
    return props.width
  }
})
const viewerHeight = computed(() => {
  if (typeof props.height === 'number') {
    return `${props.height}px`
  } else {
    return props.height
  }
})
// emitted only once when Pdfjs library is binded to vue component
// Can be used to set Pdfjs config before pdf document opening.
// function afterCreated (pdfApp: any) {
//   console.log('afterCreated pdfApp:', pdfApp)
// }
// emitted when pdf is opened but pages are not rendered
// function openHandler (pdfApp: any) {
//   console.log('open pdfApp:', pdfApp)
// }
const emit = defineEmits(['loaded'])
// emitted when pdf document pages are rendered. Can be used to set default pages scale
function pagesRendered (pdfApp: any) {
  console.log('pagesRendered pdfApp:', pdfApp)
  emit('loaded', pdfApp)
}


onMounted(async () => {

});

</script>

<template>
  <div class="experiment-page">
    <div class="experiment-container">
      <canvas ref="pdfCanvas"></canvas>
    </div>
  </div>
</template>

<style scoped>

</style>
