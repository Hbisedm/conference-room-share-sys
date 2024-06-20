import { $http } from '~/utils'

enum API {
  USER_LIST = '/user/list',
  USER_FREEZE = '/user/freeze',
}

/** [GET] 用户列表 */
export function userListApi(data: ApiUser.UserListParams) {
  return $http.get<Service.Result<{
    users: ApiUser.UserSearchResult[],
    totalCount: number
  }>>({
    url: API.USER_LIST,
    data,
  })
}

/** [GET] 冻结用户 */
export function freezeUserApi(data: ApiUser.FreezeUserParams) {
  return $http.get<Service.Result<any>>({
    url: API.USER_FREEZE,
    data,
  })
}
