import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { message } from 'ant-design-vue'

import { useEnv } from '~/composables/useEnv'
import { useUserStore } from '~/store'

const { VITE_BASE_URL } = useEnv()
const service: AxiosInstance = axios.create({
  baseURL: VITE_BASE_URL,
  timeout: 30 * 1000, // 请求超时时间
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
})

service.interceptors.request.use((config: any) => {
  if (config.requestOptions && config.requestOptions.noUseBaseUrl) {
    config.baseURL = config.url
  }
  else {
    const userStore = useUserStore()
    const accessToken = userStore.getAccessToken()
    if (accessToken)
      config.headers.authorization = `Bearer ${accessToken}`
  }
  return config
})

interface PendingTask {
  config: AxiosRequestConfig
  resolve: Function
}

let refreshing = false;
const queue: PendingTask[] = [];


service.interceptors.response.use(async (response: AxiosResponse<Service.Result, any>) => {
  const data = response.data
  const config = response.config as any
  // 外部请求
  if (config.requestOptions && config.requestOptions.noUseBaseUrl)
    return data

  if ([200, 201].includes(response.status) && ['000000'].includes(data.code as string)) {
    return data
  }
  // unLogin tip
  else if (data.code === 400) {
    message.error(data.message)
    return Promise.reject(data)
  }
  else {
    message.error(data.message)
    return Promise.reject(data)
  }
}, async (err) => {
  console.log('err', err)
  if(!err.response) {
    return Promise.reject(err)
  }
  let {data, config} = err.response
  if(refreshing) {
    return new Promise(resolve => {
      queue.push({
        config,
        resolve
      })
    })
  }

  if (data.code === 401 && !config.url.includes('/user/refresh')) {

    refreshing = true;

    const res: {data: any, code: string, msg: string} = (await refreshToken()) as any;

    refreshing = false;

    if(String(res.code) === "000000") {

        queue.forEach(({config, resolve}) => {
            resolve(service(config))
        })

        return service(config);
    } else {
        message.error(res.data);

        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
    }
  }else {
    message.error(data.data)
  }
  return Promise.reject(err.response)
})


async function refreshToken() {
  const userStore = useUserStore()
  const refreshToken = userStore.getRefreshToken()
  const res = await service.get('/user/refresh', {
      params: {
        refreshToken
      }
  });
  const {access_token, refresh_token} = res.data
  userStore.setAccessToken(access_token || '')
  userStore.setRefreshToken(refresh_token || '')
  return res;
}

interface IRequestParamConfig {
  url: string
  data?: any
  noUseBaseUrl?: boolean
}

const $http = {
  get<T = any>({
    url,
    data,
    noUseBaseUrl = false,
  }: IRequestParamConfig): Promise<T> {
    return $http.request('GET', url, { params: data }, {
      noUseBaseUrl,
    })
  },
  post<T = any>(
    {
      url,
      data,
      noUseBaseUrl = false,
    }: IRequestParamConfig,
  ): Promise<T> {
    try {
      return $http.request('POST', url, { data }, {
        noUseBaseUrl,
      })
    }
    catch (err) {
      return Promise.reject(err)
    }
  },
  request<T = any>(method = 'GET', url: string, data?: any, requestOptions?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      service({ method, url, ...data, requestOptions })
        .then((res) => {
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error | AxiosError) => {
          reject(e)
        })
    })
  },
}

export { $http }
