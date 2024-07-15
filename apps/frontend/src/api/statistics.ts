import { $http } from '~/utils'

enum API {
  meetingRoomUsedCount = '/statistic/meetingRoomUsedCount',
  userBookingCount = '/statistic/userBookingCount'
}

/** [GET] 会议室预订记录  */
export function meetingRoomUsedCountApi(data: Statistics.StatisticsParams) {
  return $http.get<Service.Result<Statistics.meetingRoomUsedResp[]>>({
    url: API.meetingRoomUsedCount,
    data,
  })
}

/** [GET] 用户预订记录 */
export function userBookingCountApi(data: Statistics.StatisticsParams) {
  return $http.get<Service.Result<Statistics.userBookingResp[]>>({
    url: API.userBookingCount,
    data,
  })
}
