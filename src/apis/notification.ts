import { httpInstance } from '@/utils/http-util'

// 获取班级申请列表
export const getNotificationList = (
  classId: number,
  searchText: string,
  page: number,
  count: number
) => {
  return httpInstance({
    url: "/announce/",
    method: "GET",
    params: {
      class_id: classId,
      content: searchText,
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  });
};