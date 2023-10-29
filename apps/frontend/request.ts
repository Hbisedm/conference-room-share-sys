import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'
import { showConfirmDialog, showToast } from 'vant'
import { useEnv } from '~/composables/useEnv'
import { useDappUserStore } from '~/store'

const { VITE_BASE_URL } = useEnv()
const service: AxiosInstance = axios.create({
  baseURL: VITE_BASE_URL,
  timeout: 200 * 1000, // 请求超时时间
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
})

service.interceptors.request.use((config: any) => {
  // 这里可以设置token: config!.headers!.Authorization = token
  if (config.requestOptions && config.requestOptions.noUseBaseUrl) {
    config.baseURL = config.url
  }
  else {
    const dappUserStore = useDappUserStore()
    const accessToken = dappUserStore.getAccessToken()
    if (accessToken)
      config.headers['Access-Token'] = accessToken
  }
  return config
})

service.interceptors.response.use(async (response: AxiosResponse) => {
  const data = response.data
  const config = response.config as any
  // 外部请求
  if (config.requestOptions && config.requestOptions.noUseBaseUrl)
    return data

  const dappUserStore = useDappUserStore()

  if (response.status === 200 && [0].includes(data.code)) {
    return data
  }
  // unLogin tip
  else if (data.code === 100001) {
    await dappUserStore.resetStore()
    showConfirmDialog({
      title: '提示',
      message: data.msg,
    }).then(() => {
      useDapp().handleLoginDapp()
    })
    return Promise.reject(data)
  }
  else {
    showToast(data.msg)
    return Promise.reject(data)
  }
}, (err) => {
  return Promise.reject(err.response)
})

interface IRequestParamConfig {
  url: string
  data?: any
  noUseBaseUrl?: boolean
}

const request = {
  get<T = any>({
    url,
    data,
    noUseBaseUrl = false,
  }: IRequestParamConfig): Promise<T> {
    return request.request('GET', url, { params: data }, {
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
      return request.request('POST', url, { data }, {
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

export default request
