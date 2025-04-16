<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { useRouter } from "vue-router"
import { Iphone, Lock, User, Document } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserData } from '@/apis/login'
import { registerUserData } from '@/apis/login'
import { useSystemStore } from '@/stores/system'
// 引入国际化组件
import { useI18n } from "vue-i18n";
import type { Action } from 'element-plus'

const { t } = useI18n();
const router = useRouter();
const systemStore = useSystemStore();

// 页面运行相关数据
const data = reactive({
  registerVisible: false,
  forgetVisible: false,
  loginLoading: false,
})
const { registerVisible, forgetVisible } = toRefs(data)

// 登录表单
const loginForm = ref({
  phone:'',
  password:''
})

// 注册表单
const registerForm = ref({
  name: '',
  phone: '',
  password: '',
  confirmPassword: '',
  verifyCode: ''
})

// 修改密码表单
const forgetForm = ref({
  phone: '',
  password: '',
  confirmPassword: '',
  verifyCode: ''
})

// 检查手机号格式
const validatePhone = (phone: string) => {
  let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/
  if(!reg.test(phone)){
    return false;
  } else {
    return true;
  }
}

// 检查密码格式
const validatePassword = (password: string) => {
  let reg = /^[a-z|A-Z|0-9]*$/
  if(!reg.test(password)){
    return false;
  } else {
    return true;
  }
}

// 检查两次输入密码
const checkPass = (confirmPassword: string) => {
  if(confirmPassword != registerForm.value.password){
    return false;
  } else {
    return true;
  }
}

// 登录
const loginSubmit = async () => {
  // 等待
  data.loginLoading = true;
  // 检查手机号格式
  if(loginForm.value.phone === "" || loginForm.value.password === ""){
    data.loginLoading = false;
      ElMessage({
      message: '请输入登录信息',
      type: 'warning',
      plain: true,
    })
  } else if(!validatePhone(loginForm.value.phone)){
    data.loginLoading = false;
    ElMessage({
      message: '手机号码格式错误',
      type: 'warning',
      plain: true,
    })
  } else if (!validatePassword(loginForm.value.password)) {
    data.loginLoading = false;
    ElMessage({
      message: '密码格式错误，密码由字母与数字组成',
      type: 'warning',
      plain: true,
    })
  } else {
    try{
      const userData = await getUserData(
        loginForm.value.phone,
        loginForm.value.password
      );
      if (userData.status == 0) {
        data.loginLoading = false;
        ElMessage({
          message: '登录成功',
          type: 'success',
          plain: true,
        })
      } else {
        ElMessage({
          message: '登录失败',
          type: 'error',
          plain: true,
        })     
      }
      // 等待
      if (userData.data) {
        // 保存用户的登录信息
        sessionStorage.userId = userData.data.id;
        sessionStorage.name = userData.data.name;
        sessionStorage.email = userData.data.email;
        sessionStorage.phone = userData.data.phone;
        sessionStorage.userType = userData.data.type;
        sessionStorage.userName = userData.data.user_name;
        sessionStorage.idcard = userData.data.idcard;
        // 设置登录状态
        localStorage.setItem('loginflag', 'true');
        localStorage.setItem('userId', userData.data.id);
        // 设置当前页激活
        if(sessionStorage.userType === '1'){
          systemStore.currentPage = 'studentMe';
        } else if (sessionStorage.userType === '2') {
          systemStore.currentPage = 'teacherMe';
        } else if (sessionStorage.userType === '3') {
          systemStore.currentPage = 'adminMe';
        }
      }
      // 跳转到相应页面
      if(sessionStorage.userType === '3'){
        router.push('/adminMe');
      } else if (sessionStorage.userType === '2') {
        router.push('/teacherMe');
      } else if (sessionStorage.userType === '1') {
        router.push('/studentMe');
      }
    }catch (e){
      ElMessageBox.alert('系统正在维护中，请稍后再试！', '消息提醒', {
        confirmButtonText: '好的',
      })
    }
  }
}

// 注册
const registerSubmit = async () => {
  // 检查手机号格式
  if(!validatePhone(registerForm.value.phone)){
    ElMessage({
      message: '手机号码格式错误',
      type: 'warning',
      plain: true,
    })
  } else if (!validatePassword(registerForm.value.password)) {
    ElMessage({
      message: '密码格式错误，密码由字母与数字组成',
      type: 'warning',
      plain: true,
    })
  } else if(!checkPass(registerForm.value.confirmPassword)) {
    ElMessage({
      message: '两次输入的密码不一致',
      type: 'warning',
      plain: true,
    })
  } else {
    const newUserData = await registerUserData(registerForm);
    registerVisible.value = false
  } 
}
</script>

<template>
  <!-- 登录区 -->
  <el-row class="login-page">
    <el-col :lg="16" :md="12" class="login-left">
      <div>
        <!-- 平台介绍 -->
        <div class="platform-name">{{$t('login.platformName')}}</div>
        <div class="platform-introduction">{{$t('login.platformInstruction')}}</div>
      </div>
    </el-col>
    <!-- 右侧 -->
    <el-col :lg="8" :md="12" class="login-right">
      <h2 class="login-welcome">欢迎回来</h2>
      <div class="login-notice">
        <span class="h-[0.15rem] w-16 bg-gray-200"></span>
          <span>请输入登录信息</span>
        <span class="h-[0.15rem] w-16 bg-gray-200"></span>
      </div>
      <el-form :model="loginForm" class="w-[20rem]">
        <!-- 输入手机号 -->
        <el-form-item>
            <el-input v-model="loginForm.phone" :placeholder="$t('login.inputPhone')">
              <!-- 图标 -->
              <template #prefix>
                <el-icon color="#0850f8" class="no-inherit">
                    <Iphone />
                </el-icon>
              </template>
            </el-input>
        </el-form-item>
        <!-- 输入密码 -->
        <el-form-item>
          <el-input type="password" v-model="loginForm.password" :placeholder="$t('login.inputPassword')">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#0850f8" class="no-inherit">
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="w-[20rem]" color="#0850f8" round :loading="data.loginLoading" @click="loginSubmit">{{$t('login.login')}}</el-button>
        </el-form-item>
      </el-form>
      <!-- 注册与忘记密码 -->
      <div class="login-link">
        <el-link class="login-link-item" type="primary" @click="registerVisible = true">注册</el-link>
        <el-link class="login-link-item" type="primary" @click="forgetVisible = true">忘记密码</el-link>
      </div>
    </el-col>
  </el-row>

  <!-- 注册框 -->
  <el-dialog v-model="registerVisible" width="400" title="注册用户信息" center>
    <div class="register-dialog">
      <!-- 头像 -->
      <!-- <el-avatar :size="70" shape="square" class="mb-3"> user </el-avatar> -->
      <!-- 用户输入 -->
      <el-form :model="registerForm" class="w-[20rem]">
        <!-- 输入昵称 -->
        <el-form-item>
          <el-input v-model="registerForm.name" placeholder="请输入昵称">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#0850f8" class="no-inherit">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 输入手机号 -->
        <el-form-item>
          <el-input v-model="registerForm.phone" placeholder="请输入手机号">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#0850f8" class="no-inherit">
                <Iphone />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 输入密码 -->
        <el-form-item>
          <el-input v-model="registerForm.password" placeholder="请输入密码">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#0850f8" class="no-inherit">
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item>
          <el-input v-model="registerForm.confirmPassword" placeholder="请确认密码">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#0850f8" class="no-inherit">
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 输入验证码 -->
        <el-row :gutter="8">
          <el-col :span="16">
            <!-- 输入框 -->
            <el-form-item>
              <el-input v-model="registerForm.verifyCode" placeholder="请输入验证码">
                <!-- 图标 -->
                <template #prefix>
                  <el-icon color="#0850f8" class="no-inherit">
                    <Document />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 发送验证码按钮 -->
          <el-col :span="8">
            <el-button color="#0850f8">获取验证码</el-button>
          </el-col>
        </el-row>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button class="w-[20rem]" color="#0850f8" @click="registerSubmit">注册</el-button>
        </el-form-item>
        </el-form>
      </div>
  </el-dialog>

  <!-- 忘记密码框 -->
  <el-dialog v-model="forgetVisible" title="请重置密码" width="400" center>
    <div class="forget-dialog">
      <!-- 用户输入 -->
      <el-form :model="forgetForm" class="w-[20rem]">
        <!-- 输入手机号 -->
        <el-form-item>
          <el-input v-model="forgetForm.phone" placeholder="请输入手机号">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#0850f8" class="no-inherit">
                <Iphone />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 输入密码 -->
        <el-form-item>
          <el-input v-model="forgetForm.password" placeholder="请输入密码">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#0850f8" class="no-inherit">
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item>
          <el-input v-model="forgetForm.confirmPassword" placeholder="请确认密码">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#0850f8" class="no-inherit">
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 输入验证码 -->
        <el-row :gutter="8">
          <el-col :span="16">
            <!-- 输入框 -->
            <el-form-item>
              <el-input v-model="forgetForm.verifyCode" placeholder="请输入验证码">
                <!-- 图标 -->
                <template #prefix>
                  <el-icon color="#0850f8" class="no-inherit">
                    <Document />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 发送验证码按钮 -->
          <el-col :span="8">
            <el-button color="#0850f8">获取验证码</el-button>
          </el-col>
        </el-row>
        <!-- 密码按钮 -->
        <el-form-item>
          <el-button class="w-[20rem]" color="#0850f8" @click="forgetVisible = false">密码修改</el-button>
        </el-form-item>
      </el-form>
      </div>
  </el-dialog>
</template>

<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
}
.login-left {
  background-image: url('../assets/img/background.png');
  @apply flex items-center justify-center;
}
.platform-name {
  @apply font-sans my-4 text-5xl font-bold text-light-100;
}
.platform-introduction {
  @apply font-sans text-lg font-bold text-light-100;
}
.login-right {
  background-color: #f9fafb;
  @apply flex items-center justify-center flex-col;
}
.login-welcome {
  @apply font-bold text-3xl text-gray-800;
}
.login-notice {
  @apply  flex items-center justify-center my-5 text-gray-300 text-2xl space-x-2;
}
.login-link {
  @apply flex-row;
}
.login-link-item {
  color: #0850f8;
  @apply m-4;
}
.register-dialog {
  width: 100%;
  @apply flex items-center justify-center flex-col pt-3;
}
.forget-dialog {
  @apply flex items-center justify-center flex-col;
}
</style>
