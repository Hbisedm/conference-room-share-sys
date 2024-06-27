  // #region 分页参数

  interface PageParams {
    pageNo: number
    pageSize: number
  }

  // #endregion



declare namespace ApiUser {


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

// #region 会议室管理
declare namespace Meeting {


  interface MeetingRoomParams extends PageParams {
    name?: string
    capacity?: string
    equipment?: string
  }

  interface MeetingRoomSearchResult {
    id: number;
    name: string;
    location: string;
    capacity: number;
    equipment: string;
    description: string;
    isBooked: boolean;
    createTime: string;
    updateTime: string;
  }

  type MeetingRoomSearchResponse =  Service.Result<{
    meetingRooms: Meeting.MeetingRoomSearchResult[],
    totalCount: number
  }>

  export interface CreateMeetingRoomParams {
    capacity: number;
    description: string;
    equipment: string;
    location: string;
    name: string;
  }

  export interface UpdateMeetingRoomParams extends CreateMeetingRoomParams {
    id: number;
  }



}
//#endregion

// #region 预约管理
declare namespace Booking {
  export interface SearchParams extends PageParams {
    bookingTimeRangeEnd?: number;
    bookingTimeRangeStart?: number;
    meetingRoomName?: string;
    meetingRoomPosition?: string;
    username?: string;
}

  interface BookingSearchResult {
    id: number;
    startTime: string;
    endTime: string;
    status: string;
    note: string;
    createTime: string;
    updateTime: string;
    user: ApiUser.UserSearchResult,
    room: Meeting.MeetingRoomSearchResult
  }

  interface BookingAddParams {
    endTime: number | null;
    meetingRoomId: number | null;
    startTime: number | null;
    note: string;
  }

  interface BookingAddDisplayParams {
    name: string;
    rangeStartDate: string;
    rangeStartTime: string;
    rangeEndDate: string;
    rangeEndTime: string;
    note: string;

  }


}
// #endregion
