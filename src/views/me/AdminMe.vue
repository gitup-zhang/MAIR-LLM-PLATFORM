<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from "vue";
import {
  User,
  Star,
  Message,
  Iphone,
  Aim,
  Location,
  House,
  Lock,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import { useSystemStore } from "@/stores/system";
import {
  getUserInfo,
  editUserInfo,
  submitModifyPassword,
  applyRole,
} from "@/apis/user";
import { getRoleApplyList, evaluateRoleApply } from "@/apis/role";
import { getLocationOption } from "@/apis/location";
import type { FormInstance, FormRules } from "element-plus";

const userStore = useUserStore();
const systemStore = useSystemStore();
const data = reactive({
  // 申请新的身份类型
  newType: userStore.roleId,
  // 申请记录
  applicationList: [],
  //位置选项
  locationOptions: [] as any,
  // 用户修改密码
  modifyPassword: {
    oldPassword: "",
    newPassowrd: "",
    checkPassword: "",
  },
  page: 1,
  count: 5,
  total: 0,
  submitPasswordLoading: false,
  userInfoEditSubmitLoading: false,
});
const { newType, applicationList, page, count, total } = toRefs(data);

// 用户信息表单
const userInfoForm = reactive({
  id: 0,
  user_name: "",
  id_number: "",
  name: "",
  email: "",
  phone: "",
  type: "",
  idcard: "",
  create_time: 0,
  modify_time: 0,
  area_id: 0,
});
const {
  id,
  user_name,
  id_number,
  name,
  email,
  phone,
  type,
  idcard,
  create_time,
  modify_time,
  area_id,
} = toRefs(userInfoForm);

// 获取用户类型
const getUserType = (userType: number) => {
  if (!userType) {
    return "未知";
  } else if (userType === 1) {
    return "学生";
  } else if (userType === 2) {
    return "教师";
  } else {
    return "教务";
  }
};
// 获取用户信息，并存储到状态中
const getAndStoreUserData = async () => {
  // 获取用户数据
  const userData = await getUserInfo();
  userInfoForm.id = userData.data.id;
  userInfoForm.user_name = userData.data.user_name;
  userInfoForm.id_number = userData.data.id_number;
  userInfoForm.name = userData.data.name;
  userInfoForm.email = userData.data.email;
  userInfoForm.phone = userData.data.phone;
  userInfoForm.type = userData.data.type;
  userInfoForm.idcard = userData.data.idcard;
  userInfoForm.create_time = userData.data.create_time;
  userInfoForm.modify_time = userData.data.modify_time;
  userInfoForm.area_id = userData.data.area_id;

  userStore.id = userData.data.id;
  userStore.nickname = userData.data.user_name;
  userStore.stuId = userData.data.id_number;
  userStore.name = userData.data.name;
  userStore.avatar = "";
  userStore.email = userData.data.email;
  userStore.phone = userData.data.phone;
  userStore.role = getUserType(userData.data.type);
  userStore.roleId = userData.data.type;
  userStore.personId = userData.data.idcard;
  userStore.createTime = userData.data.create_time;
  userStore.modifyTime = userData.data.modify_time;
  userStore.areaId = userData.data.area_id;
};
// 提交修改
const userInfoEditSubmit = async () => {
  await userInfoFormRef.value.validate();
  data.userInfoEditSubmitLoading = true;
  const res = await editUserInfo(userInfoForm, userStore.id);
  if (res.status === 0) {
    ElMessage({
      message: "修改成功",
      type: "success",
      plain: true,
    });
    // 关闭模态框
    systemStore.userInfoEditVisible = false;
    // 刷新数据
    getAndStoreUserData();
  } else {
    ElMessage({
      message: "修改失败",
      type: "error",
      plain: true,
    });
  }
  data.userInfoEditSubmitLoading = false;
};

// 获取角色申请记录列表
const getUserApplyRoleList = async () => {
  const res = await getRoleApplyList("", data.page, data.count);
  data.applicationList = res.data.list;
  data.total = res.data.total;
};
// 通过角色申请
const passRoleApply = async (currentRoleApply: any) => {
  const res = await evaluateRoleApply(currentRoleApply.id, 2);
  //  输出角色申请成功或失败提示
  if (res.status === 0) {
    ElMessage({
      message: "已通过该申请",
      type: "success",
      plain: true,
    });
  } else {
    ElMessage({
      message: "通过该申请失败",
      type: "warning",
      plain: true,
    });
  }
  getUserApplyRoleList();
};
// 拒绝角色申请
const rejectRoleApply = async (currentRoleApply: any) => {
  const res = await evaluateRoleApply(currentRoleApply.id, 3);
  //  输出角色申请成功或失败提示
  if (res.status === 0) {
    ElMessage({
      message: "已拒绝该申请",
      type: "success",
      plain: true,
    });
  } else {
    ElMessage({
      message: "拒绝申请失败",
      type: "warning",
      plain: true,
    });
  }
  getUserApplyRoleList();
};
// 分页
const handleSizeChange = (val: any) => {
  getUserApplyRoleList();
};
const handleCurrentChange = (val: any) => {
  data.page = val;
  getUserApplyRoleList();
};

// 检查密码格式
const validatePassword = (password: string) => {
  let reg = /^[a-z|A-Z|0-9]*$/;
  if (!reg.test(password)) {
    return false;
  } else {
    return true;
  }
};
// 检查两次输入密码
const checkPassword = (newPassword: string, confirmPassword: string) => {
  if (confirmPassword != newPassword) {
    return false;
  } else {
    return true;
  }
};
// 提交密码修改
const submitPasswordModify = async () => {
  data.submitPasswordLoading = true;
  // 检查非空
  if (
    data.modifyPassword.oldPassword === "" ||
    data.modifyPassword.newPassowrd === "" ||
    data.modifyPassword.checkPassword === ""
  ) {
    ElMessage({
      message: "请输入密码",
      type: "warning",
      plain: true,
    });
  } else if (
    !validatePassword(data.modifyPassword.oldPassword) ||
    !validatePassword(data.modifyPassword.newPassowrd) ||
    !validatePassword(data.modifyPassword.checkPassword)
  ) {
    // 检查类型
    ElMessage({
      message: "密码由字母与数字组成",
      type: "warning",
      plain: true,
    });
  } else if (
    !checkPassword(
      data.modifyPassword.newPassowrd,
      data.modifyPassword.checkPassword
    )
  ) {
    // 检查两次输入是否一致
    ElMessage({
      message: "两次输入密码不一致",
      type: "warning",
      plain: true,
    });
  } else {
    const newForm = {
      old_password: data.modifyPassword.oldPassword,
      new_password: data.modifyPassword.newPassowrd,
      check_password: data.modifyPassword.checkPassword,
    };
    const res = await submitModifyPassword(newForm);
    // 输出密码修改成功或失败提示
    if (res.status === 0) {
      ElMessage({
        message: "密码修改成功",
        type: "success",
        plain: true,
      });
    } else {
      ElMessage({
        message: "密码修改失败",
        type: "warning",
        plain: true,
      });
    }
  }
  data.submitPasswordLoading = false;
};

// 创建表单引用
const userInfoFormRef = ref(null);
// 表单检查
const rules = reactive({
  name: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    { min: 2, max: 12, message: "长度在 2 到 12 个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
  user_name: [
    { required: true, message: "请输入真实姓名", trigger: "blur" },
    {
      pattern: /^[\u4e00-\u9fa5]{2,10}$/,
      message: "请输入2-10个中文字符",
      trigger: "blur",
    },
  ],
  area_id: [{ required: true, message: "请选择所属地区", trigger: "change" }],
  idcard: [
    { required: true, message: "请输入身份证号", trigger: "blur" },
    {
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      message: "请输入正确的身份证号",
      trigger: "blur",
    },
  ],
});
// 关闭对话框回调函数
const handleDialogClose = () => {
  // 重置表单校验状态
  if (userInfoFormRef.value) {
    userInfoFormRef.value.resetFields();
  }
};

onMounted(async () => {
  // 挂载用户数据
  getAndStoreUserData();
  // 获取角色申请记录列表
  getUserApplyRoleList();
  // 挂载地址信息
  const res = await getLocationOption();
  data.locationOptions = res.data;
});
</script>

<template>
  <div class="me-page">
    <div class="me-container">
      <!-- 顶部轮播图 -->
      <img
        src="../../assets/img/banner.png"
        class="banner"
        alt="大模型实训平台"
      />
      <!-- 个人信息展示 -->
      <el-descriptions border>
        <el-descriptions-item :rowspan="2" :width="140" label="头像">
          <!-- 头像照片 -->
          <el-image
            style="width: 100%; height: 100%"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <el-button type="primary" @click="systemStore.openUserInfoEditModal()"
            >修改我的信息</el-button
          >
        </el-descriptions-item>
        <el-descriptions-item label="用户名">{{
          userStore.name
        }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{
          userStore.phone
        }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{
          userStore.email
        }}</el-descriptions-item>
        <el-descriptions-item label="ID">{{
          userStore.stuId
        }}</el-descriptions-item>
      </el-descriptions>
      <!-- 密码修改 -->
      <el-row class="edit-info">
        <!-- 密码修改 -->
        <el-form :model="data.modifyPassword" class="w-[40rem] flex flex-row">
          <!-- 输入原密码 -->
          <el-form-item class="mr-1">
            <el-input
              type="password"
              v-model="data.modifyPassword.oldPassword"
              placeholder="请输入原始密码"
            >
              <!-- 图标 -->
              <template #prefix>
                <el-icon color="#409efc" class="no-inherit">
                  <Lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <!-- 输入新密码 -->
          <el-form-item class="mr-1">
            <el-input
              type="password"
              v-model="data.modifyPassword.newPassowrd"
              placeholder="请输入新密码"
            >
              <!-- 图标 -->
              <template #prefix>
                <el-icon color="#409efc" class="no-inherit">
                  <Lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <!-- 确认新密码 -->
          <el-form-item class="mr-1">
            <el-input
              type="password"
              v-model="data.modifyPassword.checkPassword"
              placeholder="请确认新密码"
            >
              <!-- 图标 -->
              <template #prefix>
                <el-icon color="#409efc" class="no-inherit">
                  <Lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <!-- 确认按钮 -->
          <el-form-item>
            <el-button
              class="w-[5rem]"
              type="primary"
              @click="submitPasswordModify()"
              :loading="data.submitPasswordLoading"
              >确认修改</el-button
            >
          </el-form-item>
        </el-form>
      </el-row>
    </div>
  </div>

  <!-- 修改个人信息框 -->
  <!-- eslint-disable vue/no-multiple-template-root -->
  <el-dialog
    v-model="systemStore.userInfoEditVisible"
    title="修改我的信息"
    width="400"
    center
    @close="handleDialogClose"
  >
    <div class="edit-dialog">
      <el-form
        :model="userInfoForm"
        label-width="auto"
        class="w-[20rem]"
        :rules="rules"
        ref="userInfoFormRef"
      >
        <!-- 昵称 -->
        <el-form-item label="昵称" prop="name">
          <el-input v-model="userInfoForm.name" placeholder="请输入昵称">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- ID -->
        <el-form-item label="学号">
          <el-input
            v-model="userInfoForm.id_number"
            placeholder="请输入学号"
            disabled
          >
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Star />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userInfoForm.email" placeholder="请输入邮箱">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Message />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机">
          <el-input
            v-model="userInfoForm.phone"
            placeholder="请输入手机号"
            disabled
          >
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Iphone />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 角色 -->
        <el-form-item label="角色">
          <el-input v-model="userStore.role" placeholder="角色" disabled>
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Aim />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 真实姓名 -->
        <el-form-item label="姓名" prop="user_name">
          <el-input
            v-model="userInfoForm.user_name"
            placeholder="请输入真实姓名"
          >
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 所属地区 -->
        <el-form-item label="地区" prop="area_id">
          <el-cascader
            v-model="userInfoForm.area_id"
            :options="data.locationOptions"
            style="width: 100%"
            clearable
            placeholder="请选择所属地区"
          >
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Location />
              </el-icon>
            </template>
          </el-cascader>
        </el-form-item>
        <!-- 身份证号 -->
        <el-form-item label="身份" prop="idcard">
          <el-input
            v-model="userInfoForm.idcard"
            placeholder="请输入您的身份证号"
          >
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <House />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 修改按钮 -->
        <el-form-item>
          <el-button
            class="w-[20rem]"
            type="primary"
            @click="userInfoEditSubmit()"
            :loading="data.userInfoEditSubmitLoading"
            >提交修改</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<style scoped>
/* 整体页面设置 */
.me-page {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 pr-1 rounded-md;
}
.me-container {
  width: 100%;
  height: 100%;
  @apply p-3 rounded-md;
}
.banner {
  width: 100%;
  height: 20%;
  @apply rounded-md mb-2;
}
.edit-info {
  width: 100%;
  @apply mt-3;
}
.role-apply {
  width: 100%;
  overflow-y: auto; /* 垂直方向可滚动 */
}
.empty-text {
  height: 100%;
  width: 100%;
  @apply flex  flex-row justify-center text-light-900;
}
/* 模态框 */
.edit-dialog {
  @apply flex  flex-col items-center justify-center;
}
</style>
