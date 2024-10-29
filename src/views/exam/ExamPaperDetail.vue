<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router'
import { getExamPaperInfo } from '@/apis/exam'

const route = useRoute();

const data = reactive({
  title: '',
  canScore: false,
  canAnswer: false,
  countDown: {
    day: 0,
    hr: 0,
    min: 0,
    sec: 0
  },
  // 简答题答案

  questionList: [],
  examPaperId: route.query.id,
  // 各部分题目可见性
  jugementQuestionVisible: false,
  singleChoiceQuestionVisible: false,
  multipleChoiceQuestionVisible: false,
  gapFillQuestionVisible: false,
  easyQuestionVisible:false
})

// 获取试卷详情
const getExamPaperDetail = async () => {
  const res = await getExamPaperInfo(Number(data.examPaperId))
  console.log("!!!!!", res)
  data.title = res.data.title;
  // 判断是否有判断题
  if(res.data.question_list.judgment.length > 0){
    data.jugementQuestionVisible = true
  }
  // 判断是否有单选题
  if(res.data.question_list.single_choice.length > 0){
    data.singleChoiceQuestionVisible = true
  }
  // 判断是否有单选题
  if(res.data.question_list.multiple_choice.length > 0){
    data.multipleChoiceQuestionVisible = true
  }
  //  判断是否有填空题
  if(res.data.question_list.gap_filling.length > 0){
    data.gapFillQuestionVisible = true
  }
  //  判断是否有简答题
  if(res.data.question_list.essay_question.length > 0){
    data.easyQuestionVisible = true
  }

  data.questionList = res.data.question_list
}

onMounted(() => {
  // 挂载试卷详情信息
  getExamPaperDetail()
})

</script>

<template>
  <div class="exam-paper-page">
    <!-- 考试题目 -->
    <div class="exam-paper-title">
      <span>{{ data.title }}</span>
    </div>
    <!-- 考试注意事项 -->
    <div class="exam-paper-caution">
      <span>⚠️注意：（1）到达截止时间后，试卷将不可提交，请及时保存。（2）提交试卷后，试卷将不可修改，请谨慎提交。</span>
    </div>
    <div class="exam-paper-caution">
      <span>⚠️注意：（1）提交评分后，试卷将不可修改，请谨慎提交。</span>
    </div>
    <!-- 分割线 -->
    <el-divider/>

    <div>
      <!-- 结束时间 -->
      <div>
            距离结束:1天1:1:1
      </div>
    </div>

    <div v-if="data.jugementQuestionVisible">
      判断题问题列表
    </div>

    <div v-if="data.singleChoiceQuestionVisible">
      单选题问题列表
    </div>

    <div v-if="data.multipleChoiceQuestionVisible">
      多选题问题列表
    </div>

    <div v-if="data.gapFillQuestionVisible">
      判断题问题列表
    </div>

    <div v-if="data.easyQuestionVisible">
      <div class="question-type">简答题</div>
      <template v-for="(item, index) in data.questionList.essay_question">
        <!-- 问题项 -->
        <div class="question-box">
          <div class="question-title">{{index+1}} 、{{item.content}}({{item.question_score}}分，{{item.answer_words_limit}}字内)</div>
          <el-input
            v-model="item.answer"
            :rows="4"
            type="textarea"
            placeholder="请输入你的答案"
          />
          <!-- 分割线 -->
          <el-divider/>
          <!-- 教师手动评分 -->
          <div class="question-title">
            得分：
            <el-input-number v-model="item.answer_score" :min="0" :max="item.question_score"/>
            分
          </div>
          <!-- 最终得分 -->
          <div class="question-title">
            <div class="question">得分：{{item.answer_score}}分</div>
          </div>
          <!-- 自动评分 -->
          <div class="question">
            <el-input type="textarea" style="width: 700px" :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入评论" v-model="item.comment"/>
            <el-button size="mini" type="primary" @click="fetchComments">获取评论</el-button>
          </div>
        </div>
      </template>
    </div>

  </div>
</template>

<style scoped>
/* 整体页面设置 */
.exam-paper-page {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-1 rounded-md;
}
.exam-paper-title {
  width: 100%;
  text-align: center;
  overflow: hidden;
  @apply bg-sky-100 text-3xl text-sky-300 rounded-md p-1;
}
.exam-paper-caution {
  width: 100%;
  text-align: center;
  @apply text-base mt-6 text-gray-400;
}

.question-type {
  @apply text-3xl text-sky-300;
}
/* 问题项样式 */
.question-box {
  @apply p-2 text-base bg-sky-100 rounded-md mb-3;
}
.question-title {
  @apply mb-2;
}
</style>
