<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Document, Files, Filter, Warning, Check } from '@element-plus/icons-vue'
import { getExamInfoList } from '@/apis/exam'
import { getExamPaperList } from '@/apis/examPaper'
import { getExamQuestionList, getExamQuestionDetail, createQuestion } from '@/apis/examQuestion'
import { getExamResultList } from '@/apis/examResult'

const data = reactive({
  activeName: 'first',
  // 输入
  inputExamQuestion: '',
  inputExam: '',
  inputExamPaper: '',
  inputExamResultId: '',
  inputExamResultStuId: '',
  // 列表
  examList: [],
  examPaperList: [],
  examQuestionList: [],
  examResultList: [],
  // 表单
  questionForm: {
    answer_limit: '',
    answer_option: [],
    answer_words_limit: 0,
    content: '',
    create_time: 0,
    desc: '',
    id: 0,
    modify_time: 0,
    right_answer: '',
    status: 0,
    status_desc: '',
    type: 0,
    type_desc: '',
  },
  // 新表单
  newQuestionForm: {
    content: '',
    desc: '',
    type: 2,
    answer_option: [],
    right_answer: '',
    status: 3,
    answer_words_limit: 50
  },
  // 模态框
  questionDetailModalVisible: false,
  createQuestionModalVisible: false,
  // 类型
  typeOptions: [
    {
      value: 1,
      label: '问答题'
    }, 
    {
      value: 2,
      label: '单选题'
    }, 
    {
      value: 3,
      label: '多选题'
    }, 
    {
      value: 4,
      label: '填空题'
    }, 
    {
      value: 5,
      label: '判断题'
    }],
  page: 1,
  count: 10,
  total: 0
})

// 搜索考试
const searchExam = async () => {
  const res = await getExamInfoList(data.inputExam, data.page, data.count);
  data.examList = res.data.list;
}
// 搜索试卷
const searchExamPaper = async () => {
  const res = await getExamPaperList(data.inputExamPaper, data.page, data.count);
  data.examPaperList = res.data.list;
}


// 搜索试题
const searchExamQuestion = async () => {
  const res = await getExamQuestionList(data.inputExamQuestion, data.page, data.count);
  data.examQuestionList = res.data.list;
}
// 查看试题详情
const checkQuestionDetail = async (id: number) => {
  data.questionDetailModalVisible = true;
  const res = await getExamQuestionDetail(id);
  data.questionForm.answer_limit = res.data.answer_limit;
  data.questionForm.answer_option = res.data.answer_option;
  data.questionForm.answer_words_limit = res.data.answer_words_limit;
  data.questionForm.content = res.data.content;
  data.questionForm.create_time = res.data.create_time;
  data.questionForm.desc = res.data.desc;
  data.questionForm.id = res.data.id;
  data.questionForm.modify_time = res.data.modify_time;
  data.questionForm.right_answer = res.data.right_answer;
  data.questionForm.status = res.data.status;
  data.questionForm.status_desc = res.data.status_desc;
  data.questionForm.type = res.data.type;
  data.questionForm.type_desc = res.data.type_desc;
}
// 改变多选题答案类型
const changeType = () => {
  data.newQuestionForm.answer_option = [];
  if(data.newQuestionForm.type === 3){
    data.newQuestionForm.right_answer = [] as any;
  } else {
    data.newQuestionForm.right_answer = '';
  }
}
// 新增选项 
const addOption = () => {
  data.newQuestionForm.answer_option.push('');
}
// 删除选项
const removeOption = (option: string) => {
  let index = data.newQuestionForm.answer_option.indexOf(option);
  if(index !== -1) {
    data.newQuestionForm.answer_option.splice(index, 1);
  }
}
// 提交试题创建
const submitQuestionCreate = async (status: number) => {
  data.newQuestionForm.status = status;
  const res = await createQuestion(status, data.newQuestionForm);
  if(res.status === 0){
    ElMessage({
      message: '新试题创建成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '新试题创建失败',
      type: 'warning',
      plain: true,
    })
  }
  data.createQuestionModalVisible = false;
  searchExamPaper();
}

// 搜索考试结果
const searchExamResult = async () => {
  const res = await getExamResultList(data.inputExamResultId, data.inputExamResultStuId, data.page, data.count);
  data.examResultList = res.data.list;
}

onMounted(() => {
  // 挂载数据
  searchExam();
  searchExamPaper();
  searchExamQuestion();
  searchExamResult();
})
</script>

<template>
  <div class="education-page">
    <el-tabs v-model="data.activeName" type="border-card" class="education-tabs" @tab-click="handleClick">
      <el-tab-pane label="试题管理" name="first" class="education-pane">
        <div class="search-box">
          <div class="search-title">试题管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputExamQuestion" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入试题名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchExamQuestion()">搜索</el-button>
            <el-button type="primary" class="mr-3 h-[2rem]" @click="data.createQuestionModalVisible = true">创建新试题</el-button>
          </div>
        </div>
        <!-- 所有试题信息展示 -->
        <div class="show-list">
          <el-table :data="data.examQuestionList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"/>
            <el-table-column prop="content" label="内容"/>
            <el-table-column prop="desc" label="描述"/>
            <el-table-column prop="type_desc" label="类型" width="100"/>
            <el-table-column prop="status_desc" label="状态" width="100"/>
            <el-table-column fixed="right" label="操作" width="200">
              <template v-slot="scope">
                <el-button v-if="scope.row.status===3" link type="primary" size="small" @click="">修改</el-button>
                <el-button v-else-if="scope.row.status===1" link type="primary" size="small" @click="checkQuestionDetail(scope.row.id)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="试卷管理" name="second">
        <div class="search-box">
          <div class="search-title">试卷管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputExamPaper" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入试卷标题" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchExamPaper()">搜索</el-button>
          </div>
        </div>
        <!-- 所有试卷信息展示 -->
        <div class="show-list">
          <el-table :data="data.examPaperList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"/>
            <el-table-column prop="title" label="标题"/>
            <el-table-column prop="desc" label="描述"/>
            <el-table-column prop="status_desc" label="状态"/>
            <el-table-column prop="creator_name" label="创建者"/>
            <el-table-column prop="total_score" label="总分"/>
            <el-table-column fixed="right" label="操作">
              <template v-slot="scope">
                <el-button v-if="scope.row.status===3" link type="primary" size="small" @click="">修改</el-button>
                <el-button v-if="scope.row.status===3" link type="primary" size="small" @click="">删除</el-button>
                <el-button v-else-if="scope.row.status===1" link type="primary" size="small" @click="">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="考试管理" name="third">
        <div class="search-box">
          <div class="search-title">考试管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputExam" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入考试名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchExam()">搜索</el-button>
          </div>
        </div>
        <!-- 所有考试信息展示 -->
        <div class="show-list">
          <el-table :data="data.examList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"/>
            <el-table-column prop="desc" label="描述"/>
            <el-table-column prop="class_name" label="考试班级" width="150"/>
            <el-table-column prop="exam_paper_title" label="试卷标题"/>
            <el-table-column prop="type_desc" label="类型" width="100"/>
            <el-table-column label="考试时间">
              <template v-slot="scope">
                {{ scope.row.start_time + ' -- ' + scope.row.end_time }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="modityCollegeDetail(scope.row.id)">查看详情</el-button>
                <el-button v-if="scope.row.status===1" link type="primary" size="small" @click="removeExam(scope.row)">取消</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="考试结果" name="Fourth">
        <div class="search-box">
          <div class="search-title">考试结果</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputExamResultId" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入考试ID" />
            <el-input v-model="data.inputExamResultStuId" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入学生学号" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchExamResult()">搜索</el-button>
          </div>
        </div>
        <!-- 所有考试信息展示 -->
        <div class="show-list">
          <el-table :data="data.examResultList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"/>
            <el-table-column prop="user_id_number" label="学号"/>
            <el-table-column prop="user_name" label="学生姓名" width="150"/>
            <el-table-column prop="exam_id" label="考试ID" width="100"/>
            <el-table-column prop="exam_desc" label="考试描述"/>
            <el-table-column prop="status_desc" label="考试状态" width="100"/>
            <el-table-column label="当前得分" width="100">
              <template v-slot="scope">
                {{ scope.row.score }} / {{ scope.row.total_score }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template v-slot="scope">
                <el-button v-if="scope.row.status === 3" link type="primary" size="small" @click="">查看试卷</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto" />
        </div>
      </el-tab-pane>
  </el-tabs>

  </div>


  <!-- 查看试题详情框 -->
  <el-dialog v-model="data.questionDetailModalVisible" title="试题详情" width="600">
    <div class="exam-dialog">
      <el-descriptions
        direction="vertical"
        :column="2"
        border
      >
        <el-descriptions-item label="类型">{{ data.questionForm.type_desc }}</el-descriptions-item>
        <el-descriptions-item label="字数限制">{{ data.questionForm.answer_words_limit }}</el-descriptions-item>
        <el-descriptions-item label="内容" :span="2">{{ data.questionForm.content }}</el-descriptions-item>
        <el-descriptions-item label="问题" :span="2">{{ data.questionForm.desc }}</el-descriptions-item>
        <el-descriptions-item label="正确答案" :span="2">{{ data.questionForm.right_answer }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
  
  <!-- 创建试题框 -->
  <el-dialog v-model="data.createQuestionModalVisible" title="创建新试题" width="600">
    <div class="exam-dialog">
      <el-form :model="data.newQuestionForm" class="w-[30rem]">
        <!-- 内容 -->
        <el-form-item>
          <el-input v-model="data.newQuestionForm.content" placeholder="请输入题目内容">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Document />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 描述 -->
        <el-form-item>
          <el-input v-model="data.newQuestionForm.desc" placeholder="请输入题目描述">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Files />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 类型 -->
        <el-form-item>
          <el-select v-model="data.newQuestionForm.type" placeholder="请选择题目类型" class="w-[30rem]" @change="changeType()">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Filter />
              </el-icon>
            </template>
            <el-option
              v-for="item in data.typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 问答题 -->
        <template v-if="data.newQuestionForm.type===1">
          <el-form-item>
            <el-input-number class="w-[30rem]" v-model="data.newQuestionForm.answer_words_limit" :min="1" placeholder="请输入回答字数限制" />
          </el-form-item>
        </template>
        <!-- 单选题 -->
        <template v-if="data.newQuestionForm.type===2">
          <el-form-item 
            v-for="(option, index) in data.newQuestionForm.answer_option" 
            :label="'选项' + (index+1)"
            :key="index" 
            :prop="'answer_option[' + index + ']'" 
            style="width: 100%"
          >
            <el-input v-model="data.newQuestionForm.answer_option[index]" style="width: 80%"/>
            <el-button type="primary" class="ml-2" @click.prevent="removeOption(option)">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="w-[30rem]" type="primary" @click="addOption()">新增选项</el-button>
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="data.newQuestionForm.right_answer">
              <el-radio v-for="(option, i) in data.newQuestionForm.answer_option" :label="(i+1).toString()" border>{{ option }}</el-radio>
              </el-radio-group>
          </el-form-item>
        </template>
        <!-- 多选题 -->
        <template v-if="data.newQuestionForm.type===3">
          <el-form-item 
            v-for="(option, index) in data.newQuestionForm.answer_option" 
            :label="'选项' + (index+1)"
            :key="index" 
            :prop="'answer_option[' + index + ']'" 
            style="width: 100%"
          >
            <el-input v-model="data.newQuestionForm.answer_option[index]" style="width: 80%"/>
            <el-button type="primary" class="ml-2" @click.prevent="removeOption(option)">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="w-[30rem]" type="primary" @click="addOption()">新增选项</el-button>
          </el-form-item>
          <el-form-item>
            <el-checkbox-group v-model="data.newQuestionForm.right_answer">
              <el-checkbox v-for="(option, index) in data.newQuestionForm.answer_option" :key="index" :label="(index+1).toString()" :value="option">
                {{ option }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </template>
        <!-- 填空题 -->
        <template v-if="data.newQuestionForm.type===4">
          <el-form-item>
            <el-input v-model="data.newQuestionForm.right_answer" placeholder="请输入正确答案">
              <!-- 图标 -->
              <template #prefix>
                <el-icon color="#409efc" class="no-inherit">
                  <Check />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="data.newQuestionForm.answer_words_limit" placeholder="请输入回答字数限制">
              <!-- 图标 -->
              <template #prefix>
                <el-icon color="#409efc" class="no-inherit">
                  <Warning />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </template>
        <!-- 判断题 -->
        <template v-if="data.newQuestionForm.type===5">
          <el-form-item>
            <el-radio v-model="data.newQuestionForm.right_answer" label="1">正确</el-radio>
            <el-radio v-model="data.newQuestionForm.right_answer" label="2">错误</el-radio>
          </el-form-item>
        </template>
        <!-- 创建按钮 -->
        <el-form-item>
          <el-button class="w-[30rem]" type="primary" @click="submitQuestionCreate(1)">创建新试题</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="w-[30rem]" type="primary" @click="submitQuestionCreate(3)">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<style scoped>
/* 整体页面设置 */
.education-page {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-1 rounded-md;
}
.education-tabs {
  height: 100%;
  width: 100%;
}
.education-pane {
  height: 100%;
  width: 100%;
}
.search-box {
  height: 10vh;
  width: 100%;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  @apply flex flex-row items-center justify-center rounded-md;
}
.search-title {
  position: absolute;
  left: 2rem;
  @apply text-2xl italic font-semibold text-light-50;
}
.show-list {
  @apply flex flex-col mt-4 mr-2;
}
/* 模态框 */
.exam-dialog {
  @apply flex items-center justify-center flex-col;
}
</style>
