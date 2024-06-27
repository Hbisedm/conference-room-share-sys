import { $http } from '~/utils'

enum API {
  MEETING_ROOM_LIST = '/meeting-room/list',
  DELETE_MEETING_ROOM = '/meeting-room',
  CREATE_MEETING_ROOM = '/meeting-room/create',
  UPDATE_MEETING_ROOM = '/meeting-room/update'
}

/** [GET] 会议室列表 */
export function meetingRoomListApi(data: Meeting.MeetingRoomParams) {
  return $http.get<Meeting.MeetingRoomSearchResponse>({
    url: API.MEETING_ROOM_LIST,
    data,
  })
}


/** [DELETE] 删除会议室 */
export function deleteMeetingRoomApi(id: number) {
  return $http.delete<Service.Result<any>>({
    url: `${API.DELETE_MEETING_ROOM}/${id}`,
  })
}

/** 新增会议室 */
export function createMeetingRoomApi(data: Meeting.CreateMeetingRoomParams) {
  return $http.post<Service.Result<any>>({
    url: `${API.CREATE_MEETING_ROOM}`,
    data
  })
}

/** 更新会议室 */
export function updateMeetingRoomApi(data: Meeting.UpdateMeetingRoomParams) {
  return $http.put<Service.Result<any>>({
    url: `${API.UPDATE_MEETING_ROOM}`,
    data
  })
}
