import { $http } from '~/utils'

enum API {
  LOGIN = '/user/login',
}

/** [POST] 登录 */
export function loginApi(data: ApiUser.LoginParams) {
  return $http.post<Service.Result<ApiUser.LoginUserInfo>>({
    url: API.LOGIN,
    data,
  })
}
