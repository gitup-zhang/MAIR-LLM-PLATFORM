<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from "vue-router"
import { Iphone, Lock } from '@element-plus/icons-vue'

// 引入国际化组件
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const router = useRouter();

const loginForm = ref({
  phone:'',
  password:''
})

const toLogin = () => {
  router.push('/experiment')
}
</script>

<template>
  <el-row class="login-page">
    <el-col :lg="16" :md="12" class="login-left">
      <div>
        <!-- 平台介绍 -->
        <div class="platform-name">{{$t('login.platformName')}}</div>
        <div class="platform-introduction">{{$t('login.platformInstruction')}}</div>
      </div>
    </el-col>
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
            <el-button class="w-[20rem]" type="primary" round @click="toLogin">{{$t('login.login')}}</el-button>
        </el-form-item>
      </el-form>
       
    </el-col>
    </el-row>
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
</style>
