<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router'
import { getExamPaperInfo } from '@/apis/exam'

const route = useRoute();

const data = reactive({
  title: '',
  desc: '',
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
  type: route.query.type,
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
  data.questionList = res.data.question_list;
  data.desc = res.data.desc;
  data.canAnswer = res.data.can_answer && data.type === 'student';
  data.canScore = res.data.can_score && data.type === 'teacher';
  // 倒计时，暂时取消
  // if (data.canAnswer) {
  //   countdown(res.data.end_time)
  // }



  // 判断是否有判断题
  if(res.data.question_list.judgment.length > 0){
    data.jugementQuestionVisible = true;
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

  testdatamanage()
})

const testdatamanage = () => {
  data.jugementQuestionVisible = true;
  data.canAnswer = false;
  data.canScore = true;
}
const titileTest = ref('考试1')
const examTest = reactive(
  {
    judgment: 
      [
        {
          content: '今天我是不是吃了一个小面包',
          question_score: 1,
          answer: true,
          answer_score: 4
        },
        {
          content: '今天我是不是吃了一个小面包',
          question_score: 1,
          answer: true,
          answer_score: 4
        },
      ]
  }
)

</script>

<template>
  <div class="exam-paper-page">
    <!-- 考试头部 -->
    <div class="exam-paper-heading">
      <span class="exam-paper-title">{{ titileTest }}</span>
      <!-- 考试注意事项 -->
      <div v-if="data.canAnswer" class="exam-paper-caution">注意：（1）到达截止时间后，试卷将不可提交，请及时保存。（2）提交试卷后，试卷将不可修改，请谨慎提交。</div>
      <div v-if="data.canScore" class="exam-paper-caution">注意：（1）提交评分后，试卷将不可修改，请谨慎提交</div>
    </div>
    <!-- 判断题 -->
    <div v-if="data.jugementQuestionVisible" class="exam-item">
      <div class="exam-item-type">简答题</div>
      <template v-for="(item, index) in examTest.judgment">
        <div class="exam-item-content">
          {{index+1}} 、{{item.content}}({{item.question_score}}分)
        </div>
        <div class="exam-item-answer">
          <el-radio v-model="item.answer" :disabled="!data.canAnswer" label="1">Y</el-radio>
          <el-radio v-model="item.answer" :disabled="!data.canAnswer" label="2">N</el-radio>
        </div>
        <template v-if="!data.canAnswer">
          <div class="exam-item-answer"> 
            <el-tag type="primary">得分：{{item.answer_score}}分</el-tag>
          </div>
        </template>
      </template>
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
/* 试卷头部 */
.exam-paper-heading {
  width: 100%;
  height: 10vh;
  text-align: center;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  @apply rounded-md p-2;
}
/* 试卷标题 */
.exam-paper-title {
  @apply text-3xl italic font-semibold text-light-50;
}
/* 试卷提示 */
.exam-paper-caution {
  @apply mt-1 text-light-50;
}
/* 每个问题项 */
.exam-item {
  width: 100%;
  @apply mt-3 bg-sky-50;
}
/* 问题类型 */
.exam-item-type {
  width: 100%;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  @apply p-1 text-light-50 text-xl;
}
.exam-item-content {
  width: 100%;
  @apply p-1 text-base text-gray-700 font-normal mt-1;
}
.exam-item-answer {
  width: 100%;
  @apply p-1;
}

/* .exam-paper-caution {
  width: 100%;
  text-align: center;
  @apply text-base mt-6 text-gray-400;
} */


/* 问题项样式 */
.question-box {
  @apply p-2 text-base bg-sky-100 rounded-md mb-3;
}
.question-title {
  @apply mb-2;
}
</style>
