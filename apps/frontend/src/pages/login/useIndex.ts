import { message } from 'ant-design-vue'
import { loginApi, adminLoginApi } from '~/api/user'
import { useUserStore } from '~/store'

export function useIndex() {
  const { setUserInfo, setRefreshToken, setAccessToken } = useUserStore()

  const { handleToHome } = gotoHome()

  const adminLoginChecked = ref(false)

  const userInfo = reactive<ApiUser.LoginParams>({
    password: '',
    username: '',
  })

  async function onFinish(values: ApiUser.LoginParams) {
    let apiFn

    if(adminLoginChecked.value) {
      apiFn = adminLoginApi
    }else {
      apiFn = loginApi
    }

    const { data, message: msg } = await apiFn(values)
    setAccessToken(data.accessToken)
    setRefreshToken(data.refreshToken)
    setUserInfo(data.userInfo)
    message.success(msg)
    setTimeout(() => {
      handleToHome()
    }, 1500)
  }

  return {
    userInfo,
    onFinish,
    adminLoginChecked,
  }
}
