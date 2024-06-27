import { message } from "ant-design-vue";
import { ColumnsType } from "ant-design-vue/es/table";
import  dayjs from 'dayjs';
import { ExtractPropTypes } from "vue";
import { bookingApplyApi, bookingListApi, bookingRejectApi, bookingUnbindApi } from "~/api/bookingManage";

export function useBookingManageLogic() {
  const bookingSearchResult = ref<Booking.BookingSearchResult[]>([])


  const columns: ColumnsType<Booking.BookingSearchResult> = [
      {
          title: '会议室名称',
          dataIndex: ['room', 'name'],
      },
      {
          title: '会议室位置',
          dataIndex: ['room', 'location'],
      },
      {
          title: '预定人',
          dataIndex: ['user', 'username'],
      },
      {
          title: '开始时间',
          dataIndex: 'startTime',
      },
      {
          title: '结束时间',
          dataIndex: 'endTime',
      },
      {
          title: '审批状态',
          dataIndex: 'status',
          onFilter: (value, record) => {
            console.log('record.status', record.status)
            console.log('value:', value)
            return record.status.startsWith(value as string)
          },
          filters: [
          {
            text: '审批通过',
            value: '审批通过',
          },
          {
            text: '审批驳回',
            value: '审批驳回',
          },
          {
              text: '申请中',
              value: '申请中',
          },
          {
              text: '已解除',
              value: '已解除'
          },
        ],
      },
      {
          title: '预定时间',
          dataIndex: 'createTime',
      },
      {
          title: '备注',
          dataIndex: 'note'
      },
      {
          title: '描述',
          dataIndex: 'description'
      },
      {
          title: '操作',
          key: 'action',
      }
  ];

  const pageConfig = {
    pageNo: 1,
    pageSize: 20,
  }

  const changePage = function(pageNo: number, pageSize: number) {
      // setPageNo(pageNo);
      // setPageSize(pageSize);
  }

  const formData = ref({
      username: '',
      meetingRoomName: '',
      rangeStartDate: '',
      rangeEndDate: '',
      rangeStartTime: '',
      rangeEndTime: '',
      meetingRoomPosition: '',
  })


  async function searchBooking(data: ExtractPropTypes<typeof formData.value>) {
    let bookingTimeRangeStart
    let bookingTimeRangeEnd
    if(data.rangeStartDate && data.rangeStartTime) {
      const rangeStartDateStr = dayjs(data.rangeStartDate).format('YYYY-MM-DD');
      const rangeStartTimeStr = dayjs(data.rangeStartTime).format('HH:mm');
      bookingTimeRangeStart = dayjs(rangeStartDateStr + ' ' + rangeStartTimeStr).valueOf()
    }

    if(data.rangeEndDate && data.rangeEndTime) {
      const rangeEndDateStr = dayjs(data.rangeEndDate).format('YYYY-MM-DD');
      const rangeEndTimeStr = dayjs(data.rangeEndTime).format('HH:mm');
      bookingTimeRangeEnd = dayjs(rangeEndDateStr + ' ' + rangeEndTimeStr).valueOf()
    }

    const result = await bookingListApi({
      pageNo: pageConfig.pageNo,
      pageSize: pageConfig.pageSize,
      username: data.username,
      meetingRoomName: data.meetingRoomName,
      meetingRoomPosition: data.meetingRoomPosition,
      bookingTimeRangeStart,
      bookingTimeRangeEnd,
    })

    console.log(result.data)

    bookingSearchResult.value = result.data.bookings


  }

  async function handleApply(id:number) {
    await bookingApplyApi(id)
    message.success('状态更新成功');
    searchBooking({})
  }

  async function handleReject(id:number) {
    await bookingRejectApi(id)
    message.success('状态更新成功');
    searchBooking({})
  }

  async function handleUnbind(id:number) {
    await bookingUnbindApi(id)
    message.success('状态更新成功');
    searchBooking({})
  }

  onBeforeMount(() => {
    searchBooking({})
  })

  return {
    formData,
    bookingSearchResult,
    columns,
    pageConfig,
    changePage,
    searchBooking,
    handleApply,
    handleReject,
    handleUnbind,
  }
}
