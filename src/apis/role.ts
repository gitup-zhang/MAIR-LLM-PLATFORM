import { httpInstance } from '@/utils/http-util'
// 获取用户角色申请列表
export const getRoleApplyList = (
  idNumber: string,
  page: number,
  count: number
) => {
  return httpInstance({
    url: "/user_application/",
    method: "GET",
    params: {
      user_id: idNumber,
      page: page,
      count: count,
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  });
};

// 获取用户角色申请列表
export const getAllRoleApplyList = (
  idNumber: string,
  page: number,
  count: number
) => {
  return httpInstance({
    url: "/user_application/",
    method: "GET",
    params: {
      id_number: idNumber,
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

// 取消角色申请
export const cancelRoleApply = (id: number) => {
  return httpInstance({
    url:'/user_application/' + id + '/',
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}