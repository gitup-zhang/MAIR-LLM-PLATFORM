<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Document, Files, Filter, Warning, Check, CollectionTag } from '@element-plus/icons-vue';
import { getClassOptions } from '@/apis/class';
import { getExamInfoList, createExam, deleteExam, getExamDetail } from '@/apis/exam';
import { getExamPaperList, createExamPaper, getExamPaperDetail, modifyExamPaper, deleteExamPaper, getExamPaperOptions } from '@/apis/examPaper';
import { getExamQuestionList, getExamQuestionDetail, createQuestion, getQuestionRelation, getQuestionOptions, createQuestionRelation, deleteQuestionRelation } from '@/apis/examQuestion';
import { getExamResultList } from '@/apis/examResult';

const data = reactive({
  activeName: 'first',
  // 数据项
  currentQuestionId: undefined || 0,
  currentQuestionScore: 0,
  currentExamPaperId: 0,
  // 输入
  inputExamQuestion: '',
  inputExam: '',
  inputExamPaper: '',
  inputExamResultId: '',
  inputExamResultStuId: '',
  inputSearchExamQuestion: '',
  inputSearchCurrentExamPaperQuestion: '',
  // 列表
  examList: [],
  examPaperList: [],
  examQuestionList: [],
  examResultList: [],
  currentExamPaperQuestion: [],
  currentExamPaperQuestionList: [],
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
  examPaperForm: {
    create_time: 0,
    creator_id: 0,
    current_score: 0,
    desc: "",
    id: 0,
    modify_time: 0,
    status: 0,
    title: "",
    total_score: 0
  },
  examForm: {
    class_id: 0,
    class_name: '',
    create_time: 0,
    desc: '',
    end_time: '',
    exam_paper_id: 0,
    exam_paper_title: '',
    id: 0,
    modify_time: 0,
    start_time: '',
    status: 0,
    type: 0,
    type_desc: ''
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
  newExamPaperForm: {
    title: '',
    desc: '',
    total_score: 0
  },
  examPaperShowForm: {
    title: '',
    desc: '',
    total_score: ''
  },
  newExamForm: {
    desc: '',
    class_id: undefined,
    exam_paper_id: undefined,
    type: 2,
    time_range: ['', ''],
    start_time: '',
    end_time: ''
  },
  // 模态框
  questionDetailModalVisible: false,
  createQuestionModalVisible: false,
  createExamPaperModalVisible: false,
  modifyExamPaperModalVisible: false,
  addExamQuestionModalVisible: false,
  checkExamPaperDetailModalVisible: false,
  createExamModalVisible: false,
  checkExamDetailModalVisible: false,
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
  questionOptions: [],
  classOptions: [],
  examPaperOptions: [],
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
// 删除试卷
const removeExamPaper = async (id: number) => {
  const res = await deleteExamPaper(id);
  if(res.status === 0){
    ElMessage({
      message: '试卷删除成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '试卷删除失败',
      type: 'warning',
      plain: true,
    })
  }
  searchExamPaper();
}
// 提交试卷创建
const submitExamPaperCreate = async () => {
  const res = await createExamPaper(data.newExamPaperForm);
  if(res.status === 0){
    ElMessage({
      message: '新试卷创建成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '新试卷创建失败',
      type: 'warning',
      plain: true,
    })
  }
  data.createExamPaperModalVisible = false;
  searchExamPaper();
}
// 打开试卷修改模态框
const openModifyExamPaperModal = async (id: number) => {
  data.modifyExamPaperModalVisible = true;
  const res = await getExamPaperDetail(id);
  data.examPaperForm.create_time = res.data.create_time;
  data.examPaperForm.creator_id = res.data.creator_id;
  data.examPaperForm.current_score = res.data.current_score;
  data.examPaperForm.desc = res.data.desc;
  data.examPaperForm.id = res.data.id;
  data.examPaperForm.modify_time = res.data.modify_time;
  data.examPaperForm.status = res.data.status;
  data.examPaperForm.title = res.data.title;
  data.examPaperForm.total_score = res.data.total_score;
}
// 提交试卷修改并发布
const submitExamPaperModify = async (stauts: number) => {
  data.examPaperForm.status = stauts;
  const res = await modifyExamPaper(data.examPaperForm.id, data.examPaperForm);
  if(res.status === 0){
    ElMessage({
      message: '试卷修改成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '试卷修改失败',
      type: 'warning',
      plain: true,
    })
  }
  data.modifyExamPaperModalVisible = false;
  searchExamPaper();
}
// 保存试卷修改
const saveExamPaperModify = async (stauts: number) => {
  data.examPaperForm.status = stauts;
  const res = await modifyExamPaper(data.examPaperForm.id, data.examPaperForm);
  if(res.status === 0){
    ElMessage({
      message: '试卷保存成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '试卷保存失败',
      type: 'warning',
      plain: true,
    })
  }
  data.modifyExamPaperModalVisible = false;
  searchExamPaper();
}
// 打开添加试题模态框
const openAddExamQuestionModal = async () => {
  data.addExamQuestionModalVisible = true;
  searchAddExamQuestion();
}
// 搜索当前试卷相关试题
const searchCurrentExamQuestion = async () => {
  const res = await getQuestionRelation(data.currentExamPaperId, data.inputSearchCurrentExamPaperQuestion, data.page, data.count);
  data.currentExamPaperQuestionList = res.data.list;
} 
// 查看试题详情
const checkExamPaperDetail = async (id: number) => {
  data.currentExamPaperId = id;
  data.checkExamPaperDetailModalVisible = true;
  const res = await getExamPaperDetail(id);
  data.examPaperShowForm.title = res.data.title;
  data.examPaperShowForm.desc = res.data.desc;
  data.examPaperShowForm.total_score = res.data.total_score;
  searchCurrentExamQuestion();
}
// 搜索试题内容
const searchAddExamQuestion = async () => {
  const res = await getQuestionRelation(data.examPaperForm.id, data.inputSearchExamQuestion, data.page, data.count);
  const options = await getQuestionOptions();
  data.currentExamPaperQuestion = res.data.list;
  data.questionOptions = options.data;
}
// 添加试题
const addExamQuestion = async () => {
  if (data.currentQuestionId === 0 || data.currentQuestionId === undefined) {
    ElMessage({
      message: '请选择试题',
      type: 'warning',
      plain: true
    })
  } else if (data.currentQuestionScore === 0 || data.currentQuestionScore === undefined) {
    ElMessage({
      message: '试题分数不能为零',
      type: 'warning',
      plain: true
    })
  } else {
    const res = await createQuestionRelation(data.examPaperForm.id, data.currentQuestionId, data.currentQuestionScore);
    if(res.status === 0){
      ElMessage({
        message: '试题添加成功',
        type: 'success',
        plain: true,
      })
    } else {
      ElMessage({
        message: '试题添加失败',
        type: 'warning',
        plain: true,
      })
    }
    searchAddExamQuestion();
  }
}
// 删除已选择的试题
const removeExamPaperQuestion = async (id: number) => {
  const res = await deleteQuestionRelation(id);
  if(res.status === 0){
      ElMessage({
        message: '试题删除成功',
        type: 'success',
        plain: true,
      })
    } else {
      ElMessage({
        message: '试题删除失败',
        type: 'warning',
        plain: true,
      })
    }
  searchAddExamQuestion();
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
  searchExamQuestion();
}

// 打开创建考试模态框
const openCreateExamModal = async () => {
  data.createExamModalVisible = true;
  let res = await getClassOptions();
  data.classOptions = res.data;
  res = await getExamPaperOptions();
  data.examPaperOptions = res.data;
}
// 提交考试创建
const submitExamCreate = async () => {
  data.newExamForm.start_time = data.newExamForm.time_range[0];
  data.newExamForm.end_time = data.newExamForm.time_range[1]; 
  const res = await createExam(data.newExamForm);
  if(res.status === 0){
    ElMessage({
      message: '考试创建成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '考试创建失败',
      type: 'warning',
      plain: true,
    })
  }
  data.createExamModalVisible = false;
  searchExam();
}
// 删除考试
const removeExam = async (id: number) => {
  const res = await deleteExam(id);
  if(res.status === 0){
    ElMessage({
      message: '考试删除成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '考试删除失败',
      type: 'warning',
      plain: true,
    })
  }
  searchExam();
}
// 查看考试详情
const checkExamDetail = async (id: number) => {
  data.checkExamDetailModalVisible = true;
  const res = await getExamDetail(id);
  data.examForm.class_id = res.data.class_id;
  data.examForm.class_name = res.data.class_name;
  data.examForm.create_time = res.data.create_time;
  data.examForm.desc = res.data.desc;
  data.examForm.end_time = res.data.end_time;
  data.examForm.exam_paper_id = res.data.exam_paper_id;
  data.examForm.exam_paper_title = res.data.exam_paper_title;
  data.examForm.id = res.data.id;
  data.examForm.modify_time = res.data.modify_time;
  data.examForm.start_time = res.data.start_time;
  data.examForm.status = res.data.status;
  data.examForm.type = res.data.type;
  data.examForm.type_desc = res.data.type_desc;
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
            <el-button type="primary" class="mr-3 h-[2rem]" @click="data.createExamPaperModalVisible = true">创建新试卷</el-button>
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
                <el-button v-if="scope.row.status===3" link type="primary" size="small" @click="openModifyExamPaperModal(scope.row.id)">修改</el-button>
                <el-button v-if="scope.row.status===3" link type="primary" size="small" @click="removeExamPaper(scope.row.id)">删除</el-button>
                <el-button v-else-if="scope.row.status===1" link type="primary" size="small" @click="checkExamPaperDetail(scope.row.id)">查看详情</el-button>
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
            <el-button type="primary" class="mr-3 h-[2rem]" @click="openCreateExamModal()">创建新的考试</el-button>
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
                <el-button link type="primary" size="small" @click="checkExamDetail(scope.row.id)">查看详情</el-button>
                <el-button v-if="scope.row.status===1" link type="primary" size="small" @click="removeExam(scope.row.id)">取消</el-button>
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
                <el-button v-if="scope.row.status === 3" link type="primary" size="small" @click="checkExamPaperDetail()">查看试卷</el-button>
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
  <!-- 创建新试卷 -->
  <el-dialog v-model="data.createExamPaperModalVisible" title="创建新试卷" width="600">
    <div class="exam-dialog">
      <el-form :model="data.newExamPaperForm" class="w-[30rem]">
        <!-- 标题 -->
        <el-form-item>
          <el-input v-model="data.newExamPaperForm.title" placeholder="请输入试卷标题">
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
          <el-input v-model="data.newExamPaperForm.desc" placeholder="请输入试卷描述">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Files />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 总分 -->
        <el-form-item>
          <el-input v-model="data.newExamPaperForm.total_score" placeholder="请输入试卷总分">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <CollectionTag />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 创建新试卷 -->
        <el-form-item>
          <el-button class="w-[30rem]" type="primary" @click="submitExamPaperCreate()">创建新试卷</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
  <!-- 修改试卷 -->
  <el-dialog v-model="data.modifyExamPaperModalVisible" title="修改试卷" width="600">
    <div class="exam-dialog">
      <el-form :model="data.examPaperForm" class="w-[30rem]">
        <!-- 标题 -->
        <el-form-item>
          <el-input v-model="data.examPaperForm.title" placeholder="请输入试卷标题">
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
          <el-input v-model="data.examPaperForm.desc" placeholder="请输入试卷描述">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Files />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 总分 -->
        <el-form-item>
          <el-input v-model="data.examPaperForm.total_score" placeholder="请输入预设试卷总分">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <CollectionTag />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 当前总分 -->
        <el-form-item>
          <el-input v-model="data.examPaperForm.current_score" placeholder="当前总分" disabled>
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <CollectionTag />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="w-[30rem]" type="primary" @click="openAddExamQuestionModal()">添加试题</el-button>
        </el-form-item>
        <!-- 提交试卷修改 -->
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="发布后不可再进行修改" placement="top">
            <el-button class="w-[30rem]" type="primary" @click="submitExamPaperModify(1)">修改试卷并发布</el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="保存后可进行修改" placement="top">
            <el-button class="w-[30rem]" type="primary" @click="saveExamPaperModify(3)">保存试卷</el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
  <!-- 向试卷添加新试题 -->
  <el-dialog v-model="data.addExamQuestionModalVisible" title="添加试题" width="1000">
    <div class="exampaper-dialog">
      <div class="select-exam">
        <!-- 搜索 -->
        <el-input v-model="data.inputSearchExamQuestion" class="mr-3 w-[25vw] h-[2rem]" placeholder="请输入试题内容" />
        <el-button type="primary" class="mr-3 h-[2rem]" @click="searchAddExamQuestion()">搜索</el-button>
        <el-select v-model="data.currentQuestionId" placeholder="请选择试题" style="width: 240px">
          <el-option
            v-for="item in data.questionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            style="width: 540px"
          />
        </el-select>
        <el-input-number v-model="data.currentQuestionScore" :min="0" label="试题占分" class="ml-3"/>
        <el-button type="primary" class="ml-3 h-[2rem]" @click="addExamQuestion()">添加试题</el-button>
      </div>
      <!-- 与该试卷相关的试题信息展示 -->
      <div class="show-list">
        <el-table :data="data.currentExamPaperQuestion" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="100"/>
            <el-table-column prop="content" label="内容"/>
            <el-table-column prop="desc" label="描述"/>
            <el-table-column prop="type_desc" label="类型" width="100"/>
            <el-table-column prop="score" label="占分" width="100"/>
            <el-table-column fixed="right" label="操作" width="200">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="removeExamPaperQuestion(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto" />
        </div>
    </div>
  </el-dialog>
  <!-- 查看试卷详情 -->
  <el-dialog v-model="data.checkExamPaperDetailModalVisible" title="试题详情" width="1000">
    <div class="exampaper-dialog">
      <el-descriptions
        direction="vertical"
        :column="2"
        border
      >
        <el-descriptions-item label="标题" :span="2">{{ data.examPaperShowForm.title }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="1">{{ data.examPaperShowForm.desc }}</el-descriptions-item>
        <el-descriptions-item label="总分" :span="1">{{ data.examPaperShowForm.total_score }}</el-descriptions-item>
      </el-descriptions>
      <div class="select-exam">
        <!-- 搜索 -->
        <el-input v-model="data.inputSearchCurrentExamPaperQuestion" class="mr-3 w-[30vw] h-[2rem] mt-3" placeholder="请输入试题内容" />
        <el-button type="primary" class="mr-3 h-[2rem] mt-3" @click="searchCurrentExamQuestion()">搜索</el-button>
      </div>
      <!-- 与该试卷相关的试题信息展示 -->
      <div class="show-list">
        <el-table :data="data.currentExamPaperQuestionList" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="100"/>
            <el-table-column prop="content" label="内容"/>
            <el-table-column prop="desc" label="描述"/>
            <el-table-column prop="type_desc" label="类型" width="100"/>
            <el-table-column prop="score" label="占分" width="100"/>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto" />
        </div>
    </div>
  </el-dialog>

  <!-- 创建新的考试 -->
  <el-dialog v-model="data.createExamModalVisible" title="创建考试" width="600">
    <div class="exam-dialog">
      <el-form :model="data.newExamForm" class="w-[30rem]">
        <!-- 考试描述 -->
        <el-form-item>
          <el-input v-model="data.newExamForm.desc" placeholder="请输入考试描述">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Document />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 考试班级 -->
        <el-form-item>
          <el-select v-model="data.newExamForm.class_id" placeholder="请选择考试班级" class="w-[30rem]">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Filter />
              </el-icon>
            </template>
            <el-option
              v-for="item in data.classOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 试卷 -->
        <el-form-item>
          <el-select v-model="data.newExamForm.exam_paper_id" placeholder="请选择试卷" class="w-[30rem]">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Files />
              </el-icon>
            </template>
            <el-option
              v-for="item in data.examPaperOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 起止时间 -->
        <el-form-item>
          <el-date-picker
            v-model="data.newExamForm.time_range"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="w-[30rem]" type="primary" @click="submitExamCreate()">创建新的考试</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
  <!-- 查看考试详情 -->
  <el-dialog v-model="data.checkExamDetailModalVisible" title="考试详情" width="600">
    <div class="exam-dialog">
      <el-descriptions
        class="exam-description"
        direction="vertical"
        :column="2"
        border
      >
        <el-descriptions-item label="描述" :span="2">{{ data.examForm.desc }}</el-descriptions-item>
        <el-descriptions-item label="考试班级" :span="2">{{ data.examForm.class_name }}</el-descriptions-item>
        <el-descriptions-item label="试卷" :span="1">{{ data.examForm.exam_paper_title }}</el-descriptions-item>
        <el-descriptions-item label="类型" :span="1">{{ data.examForm.type_desc }}</el-descriptions-item>
        <el-descriptions-item label="起止时间" :span="2">{{ data.examForm.start_time + '--' + data.examForm.end_time }}</el-descriptions-item>
      </el-descriptions>
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
  width: 100%;
  @apply flex flex-col mt-4 mr-2;
}
/* 模态框 */
.exam-dialog {
  @apply flex items-center justify-center flex-col;
}
.select-exam {
  @apply flex flex-row justify-start items-start;
}
.exampaper-dialog {
  @apply flex flex-col;
}
.exam-description {
  width: 100%;
}
</style>
