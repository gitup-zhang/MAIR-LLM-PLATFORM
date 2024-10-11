<script setup lang="ts">

</script>

<template>
    <el-row>
        <!-- 侧边栏 -->
        <el-col :span="1"  class="sider-nav">
            <el-row class="sider-nav-main">
                <el-col  :span="24">
                    <el-avatar shape="square" :src="circleUrl" class="user-avatar" />
                </el-col>
            </el-row>
                
        </el-col>
        <el-col :span="23"  class="login-left">
            <!-- 头部栏 -->
            <el-row class="header-nav">
                <!-- 头部栏内容区 -->
                <div class="header-nav-main">

                </div>
            </el-row>
            <el-row class="content">
                <div class="content-main">
                    <!-- 主界面区 -->

                </div>
            </el-row>
        </el-col>
    </el-row>
</template>

<style scoped>
.sider-nav {
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    @apply bg-light-500 flex-col pt-2 pl-2 pb-2;
}
.sider-nav-main {
    width: 100%;
    height: 100%;
    @apply bg-light-50;
}
.user-avatar {
    box-sizing: border-box;
    @apply w-[3vw] h-[3vh] h-15 mt-2 ;

}
.header-nav {
    width: 100%;
    height: 8vh;
    background-color: aquamarine;
    box-sizing: border-box;
    @apply bg-light-500 p-2;
}
.header-nav-main {
    width: 100%;
    height: 100%;
    @apply bg-light-50;
}
.content {
    width: 100%;
    height: 92vh;
    box-sizing: border-box;
    @apply bg-light-500 pb-2 pl-2 pr-2;
}
.content-main {
    width: 100%;
    height: 100%;
    @apply bg-light-50;
}
</style>
