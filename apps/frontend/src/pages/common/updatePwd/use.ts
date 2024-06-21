import { message } from 'ant-design-vue'
import { updatePassword, updatePasswordCaptcha, getUserInfo } from '~/api'

type Form = ApiUser.UpdatePasswordParams

export function use() {
  const { replaceLoginPage } = useGotoPage()

  const formValue = reactive<Form>({
    captcha: '',
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
  })

  async function onFinish(values: Form) {
    const { data } = await updatePassword({
      ...values,
      username: formValue.username,
    })

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

  async function getCurrInfo() {
    const {data} = await getUserInfo()

    console.log(data)
    formValue.email = data.email
    formValue.username = data.username

  }

  onMounted(() => {
    getCurrInfo()
  })

  return {
    formValue,
    onFinish,
    sendUpdatePasswordCaptcha,
  }
}
