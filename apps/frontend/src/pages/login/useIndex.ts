import { loginApi } from '~/api/user'
import { useUserStore } from '~/store'

export function useIndex() {
  const { setUserInfo, setRefreshToken, setAccessToken } = useUserStore()

  const userInfo = reactive<ApiUser.LoginParams>({
    password: '',
    username: '',
  })

  async function onFinish(values: ApiUser.LoginParams) {
    const { data } = await loginApi(values)
    setAccessToken(data.accessToken)
    setRefreshToken(data.refreshToken)
    setUserInfo(data.userInfo)
  }

  return {
    userInfo,
    onFinish,
  }
}
