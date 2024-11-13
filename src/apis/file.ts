import { httpInstance } from '@/utils/http-util'

// 获取文件上传地址
export const getFileUploadUrl = () => {
  return httpInstance({
    url: '/file/',
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
      withCredentials: true,
  });
};