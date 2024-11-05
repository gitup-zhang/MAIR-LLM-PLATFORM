import { httpInstance } from '@/utils/http-util'
// 获取用户角色申请列表
export const getRoleApplyList = (
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

// 拒绝或同意角色申请
export const evaluateRoleApply = (id: number, status: number) => {
  return httpInstance({
    url:'/user_application/' + id + '/',
    method: "PUT",
    data: JSON.stringify({
      status: status
    }),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}