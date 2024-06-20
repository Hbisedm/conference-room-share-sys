import { message } from 'ant-design-vue'
import { useGotoPage } from '~/composables/useGotoPage'
import { register, registerCaptcha } from '~/api'

export function useRegister() {
  const { replaceLoginPage } = useGotoPage()

  const formValue = ref<ApiUser.RegisterParams>({
    username: '',
    nickName: '',
    password: '',
    email: '',
    captcha: '',
    confirmPassword: '',
  })

  async function onFinish(values: ApiUser.RegisterParams) {
    const { password, confirmPassword } = values
    if (password !== confirmPassword)
      return message.error('两次密码不一致')

    const { data } = await register(values)
    if (data) {
      message.success(data)
      setTimeout(() => {
        replaceLoginPage()
      }, 1500)
    }
  }
  async function sendCaptcha() {
    const { email } = unref(formValue.value)
    if (email) {
      const { data } = await registerCaptcha(email)
      if (data)
        message.success(data)

      else
        message.error('系统繁忙')
    }
    else {
      message.error('请输入正确的邮箱')
    }
  }

  return {
    formValue,
    onFinish,
    sendCaptcha,
  }
}
