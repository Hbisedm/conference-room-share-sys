import { message } from 'ant-design-vue'
import { updatePassword, updatePasswordCaptcha } from '~/api'

type Form = ApiUser.UpdatePasswordParams

export function useUpdatePassword() {
  const { replaceLoginPage } = useGotoPage()
  const formValue = reactive<Form>({
    captcha: '',
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
  })

  async function onFinish(values: Form) {
    const { data } = await updatePassword(values)

    if (data) {
      message.success(data)
      setTimeout(() => {
        replaceLoginPage()
      }, 1500)
    }
  }

  async function sendUpdatePasswordCaptcha() {
    const { email } = unref(formValue)
    if (email) {
      const { data } = await updatePasswordCaptcha(email)
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
    sendUpdatePasswordCaptcha,
  }
}
