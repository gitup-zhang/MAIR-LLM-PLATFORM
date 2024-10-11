<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { RouterLink, useRouter } from "vue-router"
import { Iphone, Lock, User, Document } from '@element-plus/icons-vue'

// 引入国际化组件
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const router = useRouter();

// 页面运行相关数据
const data = reactive({
  registerVisible: false,
  forgetVisible: false
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

const toExperiment = () => {
  router.push('/experiment')
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
                <el-icon color="#409efc" class="no-inherit">
                    <Iphone />
                </el-icon>
              </template>
            </el-input>
        </el-form-item>
        <!-- 输入密码 -->
        <el-form-item>
          <el-input v-model="loginForm.password" :placeholder="$t('login.inputPassword')">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
            <el-button class="w-[20rem]" type="primary" round @click="toExperiment">{{$t('login.login')}}</el-button>
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
  <el-dialog v-model="registerVisible" title="请注册" width="400">
      <div class="register-dialog">
        <!-- 头像 -->
        <el-avatar :size="70" shape="square" class="mb-3"> user </el-avatar>
        <!-- 用户输入 -->
        <el-form :model="registerForm" class="w-[20rem]">

          <!-- 输入昵称 -->
          <el-form-item>
            <el-input v-model="registerForm.name" placeholder="请输入昵称">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
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
              <el-icon color="#409efc" class="no-inherit">
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
              <el-icon color="#409efc" class="no-inherit">
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
              <el-icon color="#409efc" class="no-inherit">
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
                  <el-icon color="#409efc" class="no-inherit">
                    <Document />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 发送验证码按钮 -->
          <el-col :span="8">
            <el-button type="primary">获取验证码</el-button>
          </el-col>
        </el-row>

        <!-- 注册按钮 -->
        <el-form-item>
          <el-button class="w-[20rem]" type="primary" @click="registerVisible = false">注册</el-button>
        </el-form-item>
      </el-form>
      </div>
  </el-dialog>

  <!-- 忘记密码框 -->
  <el-dialog v-model="forgetVisible" title="请重置密码" width="400">
      <div class="forget-dialog">
        <!-- 用户输入 -->
        <el-form :model="forgetForm" class="w-[20rem]">

          <!-- 输入手机号 -->
          <el-form-item>
            <el-input v-model="forgetForm.phone" placeholder="请输入手机号">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
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
              <el-icon color="#409efc" class="no-inherit">
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
              <el-icon color="#409efc" class="no-inherit">
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
                  <el-icon color="#409efc" class="no-inherit">
                    <Document />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 发送验证码按钮 -->
          <el-col :span="8">
            <el-button type="primary">获取验证码</el-button>
          </el-col>
        </el-row>

        <!-- 密码按钮 -->
        <el-form-item>
          <el-button class="w-[20rem]" type="primary" @click="forgetVisible = false">密码修改</el-button>
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
  @apply m-4;
}
.register-dialog {
  @apply flex items-center justify-center flex-col;
}
.forget-dialog {
  @apply flex items-center justify-center flex-col;
}
</style>
