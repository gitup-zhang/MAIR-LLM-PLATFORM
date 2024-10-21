import axios from 'axios'

export const httpInstance = axios.create({
    baseURL: '/system',
    timeout: 5000
})

// 拦截器
httpInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (err) => Promise.reject(err)
)
// 拦截器
httpInstance.interceptors.response.use(
    (res) => res.data,
    (err) => Promise.reject(err)
)