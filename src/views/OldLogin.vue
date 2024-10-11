<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router"
// 引入国际化组件
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter()

// 向后端发送的表单数据
const loginForm = ref({
  phone: "",
  password: "",
});

const toLogin = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login-page">
    <!-- 用户登录输入区 -->
    <span class="platform-title">{{$t('login.platformName')}}</span>
    <span class="platform-instruction">{{$t('login.platformInstruction')}}</span>
    <div class="login-input-container">
      <a-space direction="vertical" size="large">
        <!-- 手机号输入 -->
        <a-input :style="{width:'320px'}" :placeholder="$t('login.inputPhone')" v-model="loginForm.phone">
          <template #prefix>
            <icon-phone />
          </template>
        </a-input>
        <!-- 密码输入 -->
        <a-input-password :style="{width:'320px'}" :placeholder="$t('login.inputPassword')" v-model="loginForm.password">
          <template #prefix>
            <icon-stamp />
          </template>
        </a-input-password>
        <!-- 登录按钮  -->
        <a-button type="primary" size="large" long @click="toLogin">{{$t('login.login')}}</a-button>
        <RouterLink to="/register" class="register-font">{{$t('login.register')}}</RouterLink>
        <RouterLink to="/forget" class="forget-font">{{$t('login.frogetPassword')}}</RouterLink>
      </a-space>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  text-align: center;
  box-sizing: border-box;
  background-color: aliceblue;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.platform-title {
  font-weight: 1000;
  font-size: 30px;
  margin-bottom: 10px;
  /* 设置字体颜色渐变 */
  background: linear-gradient(-225deg, #2CD8D5 0%, #C5C1FF 56%, #FFBAC3 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.login-input-container {
  width: 20vw;
  height: 30vh;
  /* background-color: aqua; */
  /* margin: 0 auto; */
  padding: 10px;
  border-radius: 15px;
}
.platform-instruction {
  font-weight: 1000;
  font-size: 15px;
  margin-bottom: 10px;
}
.register-font {
  text-decoration: none;
}
.forget-font {
  text-decoration: none;
}
</style>
