import { httpInstance } from '@/utils/http-util'

// 获取班级申请列表
export const getClassApplyList = (
  userId: string,
  page: number,
  count: number
) => {
  return httpInstance({
    url: "/user_application/",
    method: "GET",
    params: {
      id_number: userId,
      page: page,
      count: count,
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  });
};