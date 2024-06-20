import { message } from 'ant-design-vue'
import { loginApi } from '~/api/user'
import { useUserStore } from '~/store'
import { useGotoPage } from '~/composables/useGotoPage'

export function useIndex() {
  const { setUserInfo, setRefreshToken, setAccessToken } = useUserStore()

  const { pushHomePage } = useGotoPage()

  const userInfo = reactive<ApiUser.LoginParams>({
    password: '',
    username: '',
  })

  async function onFinish(values: ApiUser.LoginParams) {
    const { data, message: msg } = await loginApi(values)
    setAccessToken(data.accessToken)
    setRefreshToken(data.refreshToken)
    setUserInfo(data.userInfo)
    message.success(msg)
    setTimeout(() => {
      pushHomePage()
    }, 1500)
  }

  return {
    userInfo,
    onFinish,
  }
}
