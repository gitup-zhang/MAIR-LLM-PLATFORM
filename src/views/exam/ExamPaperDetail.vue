<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import {
  getExamPaperInfo,
  getExamComment,
  saveExamScore,
  saveExamAnswer,
} from "@/apis/exam";

const route = useRoute();

const data = reactive({
  title: "",
  desc: "",
  canScore: false,
  canAnswer: false,
  countDown: {
    day: 0,
    hr: 0,
    min: 0,
    sec: 0,
  },
  // 简答题答案
  questionList: [],
  examPaperId: route.query.id as any,
  type: route.query.type,
  // 各部分题目可见性
  jugementQuestionVisible: false,
  singleChoiceQuestionVisible: false,
  multipleChoiceQuestionVisible: false,
  gapFillQuestionVisible: false,
  easyQuestionVisible: false,
  // 是否生成自动评论
  isCommentsFetched: false,
  getExamPaperDetailLoading: true,
  fetchCommentsLoading: false,
  saveScoreLoading: false,
  submitScoreLoading: false,
  saveAnswerLoading: false,
  submitAnswerLoading: false,
});

// 获取试卷详情
const getExamPaperDetail = async () => {
  const res = await getExamPaperInfo(Number(data.examPaperId));
  data.title = res.data.title;
  data.questionList = res.data.question_list;
  data.desc = res.data.desc;
  data.canAnswer = res.data.can_answer && data.type === "student";
  data.canScore = res.data.can_score && data.type === "teacher";
  // 倒计时，暂时取消
  // if (data.canAnswer) {
  //   countdown(res.data.end_time)
  // }
  //  判断是否有判断题
  if (res.data.question_list.judgment.length > 0) {
    data.jugementQuestionVisible = true;
  }
  // 判断是否有单选题
  if (res.data.question_list.single_choice.length > 0) {
    data.singleChoiceQuestionVisible = true;
  }
  // 判断是否有单选题
  if (res.data.question_list.multiple_choice.length > 0) {
    data.multipleChoiceQuestionVisible = true;
  }
  //  判断是否有填空题
  if (res.data.question_list.gap_filling.length > 0) {
    data.gapFillQuestionVisible = true;
  }
  //  判断是否有简答题
  if (res.data.question_list.essay_question.length > 0) {
    data.easyQuestionVisible = true;
  }
  data.questionList = res.data.question_list;
  data.getExamPaperDetailLoading = false;
};
// 自动获取试卷评分
const fetchComments = async () => {
  data.fetchCommentsLoading = true;
  const res = await getExamComment(data.examPaperId);
  if (res.status === 0) {
    ElMessage({
      message: "大模型已成功生成评语",
      type: "success",
      plain: true,
    });
  } else {
    ElMessage({
      message: "大模型生成评语失败",
      type: "warning",
      plain: true,
    });
  }
  data.fetchCommentsLoading = false;
  data.isCommentsFetched = true;
  getExamPaperDetail();
};
// 保存评分
const saveScore = async (operation: string) => {
  data.saveScoreLoading = true;
  const res = await saveExamScore(
    data.examPaperId,
    data.questionList,
    operation
  );
  if (res.status === 0) {
    ElMessage({
      message: "评分已成功保存",
      type: "success",
      plain: true,
    });
  } else {
    ElMessage({
      message: "评分保存失败",
      type: "warning",
      plain: true,
    });
  }
  data.saveScoreLoading = false;
  getExamPaperDetail();
};
// 提交评分
const submitScore = async () => {
  data.submitScoreLoading = true;
  const res = await saveExamScore(
    data.examPaperId,
    data.questionList,
    "submit"
  );
  if (res.status === 0) {
    ElMessage({
      message: "评分已提交",
      type: "success",
      plain: true,
    });
  } else {
    ElMessage({
      message: "评分提交失败",
      type: "warning",
      plain: true,
    });
  }
  data.submitScoreLoading = false;
  getExamPaperDetail();
};
// 保存作答结果
const saveAnswer = async (operation: string) => {
  data.saveAnswerLoading = true;
  const res = await saveExamAnswer(
    data.examPaperId,
    data.questionList,
    operation
  );
  if (res.status === 0) {
    ElMessage({
      message: "作答结果保存成功",
      type: "success",
      plain: true,
    });
  } else {
    ElMessage({
      message: "作答结果保存失败",
      type: "warning",
      plain: true,
    });
  }
  data.saveAnswerLoading = false;
  getExamPaperDetail();
};
// 提交作答结果
const submitAnswer = async () => {
  data.submitAnswerLoading = true;
  const res = await saveExamAnswer(
    data.examPaperId,
    data.questionList,
    "submit"
  );
  if (res.status === 0) {
    ElMessage({
      message: "作答结果保存成功",
      type: "success",
      plain: true,
    });
  } else {
    ElMessage({
      message: "作答结果保存失败",
      type: "warning",
      plain: true,
    });
  }
  data.submitAnswerLoading = false;
  getExamPaperDetail();
};

onMounted(() => {
  // 挂载试卷详情信息
  getExamPaperDetail();
});
</script>

<template>
  <el-scrollbar
    class="exam-paper-page"
    v-loading="data.getExamPaperDetailLoading"
  >
    <!-- 考试头部 -->
    <div class="exam-paper-heading">
      <span class="exam-paper-title">{{ data.title }}</span>
      <!-- 考试注意事项 -->
      <div v-if="data.canAnswer" class="exam-paper-caution">
        注意：（1）到达截止时间后，试卷将不可提交，请及时保存。（2）提交试卷后，试卷将不可修改，请谨慎提交。
      </div>
      <div v-if="data.canScore" class="exam-paper-caution">
        注意：（1）提交评分后，试卷将不可修改，请谨慎提交
      </div>
    </div>
    <!-- 判断题 -->
    <div v-if="data.jugementQuestionVisible" class="exam-item">
      <div class="exam-item-type">简答题</div>
      <template v-for="(item, index) in data.questionList.judgment">
        <div class="exam-item-content">
          <el-tag round type="primary">
            {{ index + 1 }}
          </el-tag>
          {{ item.content }}
          <el-tag type="primary"> 分值:{{ item.question_score }}分 </el-tag>
        </div>
        <div class="exam-item-answer">
          <el-radio v-model="item.answer" :disabled="!data.canAnswer" label="1"
            >Y</el-radio
          >
          <el-radio v-model="item.answer" :disabled="!data.canAnswer" label="2"
            >N</el-radio
          >
        </div>
        <template v-if="!data.canAnswer">
          <div class="exam-item-answer">
            <el-tag type="primary" effect="dark"
              >得分：{{ item.answer_score }}分</el-tag
            >
          </div>
        </template>
      </template>
    </div>
    <!-- 单选题 -->
    <div v-if="data.singleChoiceQuestionVisible" class="exam-item">
      <div class="exam-item-type">单选题</div>
      <template v-for="(item, index) in data.questionList.single_choice">
        <div class="exam-item-content">
          <el-tag round type="primary">
            {{ index + 1 }}
          </el-tag>
          {{ item.content }}
          <el-tag type="primary"> 分值:{{ item.question_score }}分 </el-tag>
        </div>
        <div class="exam-item-answer">
          <template v-for="(choice, j) in item.answer_option">
            <el-radio
              v-model="item.answer"
              :disabled="!data.canAnswer"
              :label="(j + 1).toString()"
              >{{ choice }}</el-radio
            >
          </template>
        </div>
        <template v-if="!data.canAnswer">
          <div class="exam-item-answer">
            <el-tag type="primary" effect="dark"
              >得分：{{ item.answer_score }}分</el-tag
            >
          </div>
        </template>
      </template>
    </div>
    <!-- 多选题 -->
    <div v-if="data.multipleChoiceQuestionVisible" class="exam-item">
      <div class="exam-item-type">多选题</div>
      <template v-for="(item, index) in data.questionList.multiple_choice">
        <div class="exam-item-content">
          <el-tag round type="primary">
            {{ index + 1 }}
          </el-tag>
          {{ item.content }}
          <el-tag type="primary"> 分值:{{ item.question_score }}分 </el-tag>
        </div>
        <div class="exam-item-answer">
          <el-checkbox-group v-model="item.answer" :disabled="!data.canAnswer">
            <el-checkbox
              v-for="(choice, j) in item.answer_option"
              :label="(j + 1).toString()"
              :key="j"
              >{{ choice }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
        <template v-if="!data.canAnswer">
          <div class="exam-item-answer">
            <el-tag type="primary" effect="dark"
              >得分：{{ item.answer_score }}分</el-tag
            >
          </div>
        </template>
      </template>
    </div>
    <!-- 填空题 -->
    <div v-if="data.gapFillQuestionVisible" class="exam-item">
      <div class="exam-item-type">填空题</div>
      <template v-for="(item, index) in data.questionList.gap_filling">
        <div class="exam-item-content">
          <el-tag round type="primary">
            {{ index + 1 }}
          </el-tag>
          {{ item.content }}
          <el-tag type="primary"> 分值:{{ item.question_score }}分 </el-tag>
        </div>
        <div class="exam-item-answer">
          <el-input
            style="width: 100%"
            :disabled="!data.canAnswer"
            :maxlength="item.answer_words_limit"
            show-word-limit
            placeholder="请输入答案"
            v-model="item.answer"
          />
        </div>
        <template v-if="!data.canAnswer">
          <div class="exam-item-answer">
            <el-tag type="primary" effect="dark"
              >得分：{{ item.answer_score }}分</el-tag
            >
          </div>
        </template>
        <template v-if="data.canScore">
          <div class="exam-item-answer">
            <el-input
              type="textarea"
              style="width: 100%"
              :autosize="{ minRows: 2, maxRows: 10 }"
              placeholder="请输入评论"
              v-model="item.comment"
            />
          </div>
        </template>
      </template>
    </div>
    <!-- 问答题 -->
    <div v-if="data.easyQuestionVisible" class="exam-item">
      <div class="exam-item-type">问答题</div>
      <template v-for="(item, index) in data.questionList.essay_question">
        <div class="exam-item-content">
          <el-tag round type="primary">
            {{ index + 1 }}
          </el-tag>
          {{ item.content }}
          <el-tag type="primary"> 分值:{{ item.question_score }}分 </el-tag>
          <el-tag type="primary" class="ml-2">
            {{ item.answer_words_limit }}字内
          </el-tag>
          <div class="exam-item-answer">
            <el-input
              v-model="item.answer"
              :rows="4"
              type="textarea"
              placeholder="请输入你的答案"
              :disabled="!data.canAnswer"
              :maxlength="item.answer_words_limit"
            />
          </div>
          <template v-if="data.canScore" class="exam-item-answer">
            <div class="exam-item-content">
              得分：
              <el-input-number
                v-model="item.answer_score"
                :min="0"
                :max="item.question_score"
              />
              分
            </div>
          </template>
          <template v-if="!data.canAnswer">
            <div class="exam-item-answer">
              <el-tag type="primary" effect="dark"
                >得分：{{ item.answer_score }}分</el-tag
              >
            </div>
          </template>
          <!-- 自动评分 -->
          <template v-if="data.canScore">
            <div class="exam-item-answer">
              <el-row class="auto-judge-box">
                <el-col :span="20">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 10 }"
                    placeholder="请输入评论"
                    v-model="item.comment"
                  />
                </el-col>
                <el-col :span="4" class="p-2">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="fetchComments"
                    :loading="data.fetchCommentsLoading"
                    >自动获取评语</el-button
                  >
                </el-col>
              </el-row>
            </div>
          </template>
        </div>
      </template>
    </div>
    <div class="btn-box">
      <template v-if="data.canScore">
        <el-button
          size="mini"
          type="primary"
          @click="saveScore('score')"
          :loading="data.saveScoreLoading"
          >保存评分</el-button
        >
        <el-button
          size="mini"
          type="primary"
          @click="submitScore()"
          :loading="data.submitScoreLoading"
          >提交评分</el-button
        >
      </template>
      <template v-if="data.canAnswer">
        <el-button
          size="mini"
          type="primary"
          @click="saveAnswer('save')"
          :loading="data.saveAnswerLoading"
          >保存作答</el-button
        >
        <el-button
          size="mini"
          type="primary"
          @click="submitAnswer()"
          :loading="data.submitAnswerLoading"
          >提交试卷</el-button
        >
      </template>
    </div>
  </el-scrollbar>
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
.auto-judge-box {
  width: 100%;
}
.btn-box {
  @apply mt-2 mb-2 flex flex-row justify-center;
}
</style>
