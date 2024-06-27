import { message, FormInstance } from "ant-design-vue";
import { ColumnsType } from "ant-design-vue/es/table";
import { bookingAddApi } from "~/api";
import  dayjs from 'dayjs';
import { meetingRoomListApi, deleteMeetingRoomApi } from '~/api/meetingRoomManage'

const DEFAULT_MODAL_FORM_DATA: Booking.BookingAddParams = {
  endTime: null,
  startTime: null,
  meetingRoomId: null,
  note: ''
}

const DEFAULT_DISPLAY_DATA: Booking.BookingAddDisplayParams = {
  name: '',
  note: '',
  rangeEndDate: '',
  rangeStartDate: '',
  rangeEndTime: '',
  rangeStartTime: '',
}

export function useMeetingRoomManageLogic() {


  const formRef = ref<FormInstance | null>(null)

  const formData = ref({
      name: '',
      capacity: '',
      equipment: ''
  })

  const displayData = ref<Booking.BookingAddDisplayParams>({...DEFAULT_DISPLAY_DATA})

  const modalFormData = reactive<Booking.BookingAddParams>({...DEFAULT_MODAL_FORM_DATA})

  const updateId = ref<number | null>(null)

  const modalOpen = ref(false)

  const modalTitle = '预订会议室'

  const columns: ColumnsType<Meeting.MeetingRoomSearchResult> = [
      {
          title: '名称',
          dataIndex: 'name'
      },
      {
          title: '容纳人数',
          dataIndex: 'capacity',
      },
      {
          title: '位置',
          dataIndex: 'location'
      },
      {
          title: '设备',
          dataIndex: 'equipment'
      },
      {
          title: '描述',
          dataIndex: 'description'
      },
      {
          title: '添加时间',
          dataIndex: 'createTime'
      },
      {
          title: '上次更新时间',
          dataIndex: 'updateTime'
      },
          {
          title: '预定状态',
          key: 'isBooked',

      },
      {
        title: '操作',
        key: 'action',
      }
  ];

  const dataSource = ref<Meeting.MeetingRoomSearchResult[]>([])


  async function searchUser({ name= '', capacity= '',  equipment='' }){
    const {data} = await meetingRoomListApi({
      name,
      capacity,
      equipment,
      pageNo: 1,
      pageSize: 10,
    })
    dataSource.value = data.meetingRooms
  }

  function handleEdit(data: Meeting.MeetingRoomSearchResult) {

    updateId.value = data.id

    const {capacity, description, equipment, location, name} = data
    Object.assign(modalFormData, {
      capacity,
      description,
      equipment,
      location,
      name
    })

    handleOpenModal()
  }

  function handleOpenModal() {
    modalOpen.value = true
  }

  function handleModalCancel() {
    Object.assign(modalFormData, {...DEFAULT_MODAL_FORM_DATA})
    modalOpen.value = false
  }

  async function handleModalOk() {
    console.log('formRef.value::')
    const fields = formRef.value!.getFieldsValue()
    // formRef.value!.fin
    // formRef.value!.
    console.log(fields)
    let updatedRows: boolean
    updatedRows = await handleInsertMeetingRoom()
    if(updatedRows) {
      handleModalCancel()
    }
    searchUser(formData.value)
  }

  async function handleInsertMeetingRoom() {
    try {

      const rangeStartDateStr = dayjs(displayData.value.rangeStartDate).format('YYYY-MM-DD');
      const rangeStartTimeStr = dayjs(displayData.value.rangeStartTime).format('HH:mm');
      const startTime = dayjs(rangeStartDateStr + ' ' + rangeStartTimeStr).valueOf()

      const rangeEndDateStr = dayjs(displayData.value.rangeEndDate).format('YYYY-MM-DD');
      const rangeEndTimeStr = dayjs(displayData.value.rangeEndTime).format('HH:mm');
      const endTime = dayjs(rangeEndDateStr + ' ' + rangeEndTimeStr).valueOf()

      modalFormData.endTime = endTime
      modalFormData.startTime = startTime
      modalFormData.note = displayData.value.note

      await bookingAddApi(modalFormData)
      message.success('预订成功')
      return true
    }catch(e) {
      return false
    }
  }


  async function handleBooking(currentMeetingRoom: Meeting.MeetingRoomSearchResult){

    modalFormData.meetingRoomId = currentMeetingRoom.id
    displayData.value.name = currentMeetingRoom.name


    modalOpen.value = true


  }

  onBeforeMount(() => {
    searchUser({})
  })

  return {
    formRef,
    formData,
    displayData,
    columns,
    modalOpen,
    dataSource,
    modalTitle,
    modalFormData,
    searchUser,
    handleOpenModal,
    handleModalOk,
    handleModalCancel,
    handleEdit,
    handleBooking,
  }
}
