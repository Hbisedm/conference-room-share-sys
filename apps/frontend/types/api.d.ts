declare namespace ApiUser {
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

  interface LoginUserInfo {
    userInfo: UserInfo
    accessToken: string
    refreshToken: string
  }
}
