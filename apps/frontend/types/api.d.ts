declare namespace ApiUser {

  // #region 分页参数

  interface PageParams {
    pageNo: number
    pageSize: number
  }

  // #endregion


  //#region  登录
  interface LoginParams {
    username: string
    password: string
  }

  interface Permission {
    id: number
    code: string
    description: string
  }

  interface UserInfo {
    id: number
    username: string
    nickName: string
    email: string
    phoneNumber?: any
    headPic: string
    createTime: number
    isFrozen: boolean
    isAdmin: boolean
    roles: string[]
    permissions: Permission[]
  }

  interface LoginUserVo {
    userInfo: UserInfo
    accessToken: string
    refreshToken: string
  }

  //#endregion

  //#region 注册

  interface RegisterParams {
      username: string;
      nickName: string;
      password: string;
      email: string;
      captcha: string;
      confirmPassword?: string;
  }

  //#endregion

  //#region  更新密码

  interface UpdatePasswordParams {
      username: string;
      email: string;
      captcha: string;
      password: string;
      confirmPassword?: string;
  }

  //#endregion

  interface UpdateUser{
    headPic: string;
    nickName: string;
    email: string;
    captcha: string;
  }

  // #region  用户管理

  interface UserListParams extends PageParams{
    username: string
    nickName: string
    email: string
  }

  interface UserSearchResult {
    username: string;
    nickName: string;
    email: string;
    headPic: string | null;
    createTime: Date;
}


interface FreezeUserParams {
  userId: number;
}

  // #endregion
}
