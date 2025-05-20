module.exports = {
  root: true, // 确保 ESLint 不会继续往父级目录查找配置
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended', // 如果是 Vue 项目
  ],
  rules: {
    'vue/no-multiple-template-root': 'off',
    'vue/require-v-for-key': 'off'
  }
}