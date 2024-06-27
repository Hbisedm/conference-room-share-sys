import { $http } from '~/utils'

enum API {
  BOOKING_LIST = '/booking/list',
  ADD = '/booking/add',
  APPLY = '/booking/apply',
  REJECT = '/booking/reject',
  UNBIND = '/booking/unbind',
}

/** [GET] 预订列表 */
export function bookingListApi(data: Booking.SearchParams) {
  return $http.get<Service.Result<{
    bookings: Booking.BookingSearchResult[],
    totalCount: number,
  }>>({
    url: API.BOOKING_LIST,
    data,
  })
}

export function bookingAddApi(data: Booking.BookingAddParams) {
  return $http.post({
    url: API.ADD,
    data
  })
}

export function bookingApplyApi(id: number) {
  return $http.get({
    url: `${API.APPLY}/${id}`,
  })
}

export function bookingRejectApi(id: number) {
  return $http.get({
    url: `${API.REJECT}/${id}`,
  })
}

export function bookingUnbindApi(id: number) {
  return $http.get({
    url: `${API.UNBIND}/${id}`,
  })
}
