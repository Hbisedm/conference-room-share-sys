import { $http } from '~/utils'

enum API {
  LOGIN = '/user/login',
  REGISTER_CAPTCHA = '/user/register-captcha',
  REGISTER = '/user/register',
  UPDATE_PASSWORD = '/user/update_password',
  UPDATE_PASSWORD_CAPTCHA = '/user/update_password/captcha',
  USER_INFO = '/user/info',
  UPDATE_USER_INFO = '/user/update',
  UPDATE_USER_INFO_CAPTCHA = '/user/update/captcha',
}

/** [POST] 登录 */
export function loginApi(data: ApiUser.LoginParams) {
  return $http.post<Service.Result<ApiUser.LoginUserVo>>({
    url: API.LOGIN,
    data,
  })
}

/** [POST] 注册验证码 */
export function registerCaptcha(address: string) {
  return $http.get<Service.Result<string>>({
    url: API.REGISTER_CAPTCHA,
    data: {
      address,
    },
  })
}

export function register(data: ApiUser.RegisterParams) {
  return $http.post<Service.Result<string>>({
    url: API.REGISTER,
    data,
  })
}

export function updatePassword(data: ApiUser.UpdatePasswordParams) {
  return $http.post<Service.Result<string>>({
    url: API.UPDATE_PASSWORD,
    data,
  })
}

/** [POST] 更新密码验证码 */
export function updatePasswordCaptcha(address: string) {
  return $http.get<Service.Result<string>>({
    url: API.UPDATE_PASSWORD_CAPTCHA,
    data: {
      address,
    },
  })
}

/** 获取用户信息 */
export function getUserInfo() {
  return $http.get<Service.Result<ApiUser.UserInfo>>({
    url: API.USER_INFO,
  })
}

/** 更新用户信息 */
export function updateUserInfo(data: ApiUser.UpdateUser) {
  return $http.post<Service.Result<boolean>>({
    url: API.UPDATE_USER_INFO,
    data
  })
}

/** 更新用户信息验证码 */
export function updateUserInfoCaptcha() {
  return $http.get<Service.Result<boolean>>({
    url: API.UPDATE_USER_INFO_CAPTCHA,
  })
}

