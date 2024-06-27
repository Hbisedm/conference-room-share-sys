import { message } from "ant-design-vue";
import { ColumnsType } from "ant-design-vue/es/table";
import { meetingRoomListApi, deleteMeetingRoomApi, createMeetingRoomApi, updateMeetingRoomApi } from '~/api/meetingRoomManage'

const DEFAULT_MODAL_FORM_DATA: Meeting.CreateMeetingRoomParams = {
    capacity: 0,
    description: '',
    equipment: '',
    location: '',
    name: ''
  }

export function useMeetingRoomManageLogic() {

  const formData = ref({
      name: '',
      capacity: '',
      equipment: ''
  })

  const modalFormData = reactive<Meeting.CreateMeetingRoomParams>({...DEFAULT_MODAL_FORM_DATA})

  const updateId = ref<number | null>(null)

  const modalOpen = ref(false)

  const modalTitle = computed(() => updateId.value? '编辑会议室' : '新建会议室')

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

  async function handleDelete(id: number) {
    try {
      await deleteMeetingRoomApi(id)
      message.success('删除成功')
      await searchUser(formData.value)
    }catch(e) {
      message.error('删除失败')
    }
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
    let updatedRows: boolean
    if(updateId.value) {
      updatedRows = await handleUpdateMeetingRoom()
    }else {
      updatedRows = await handleInsertMeetingRoom()
    }
    if(updatedRows) {
      handleModalCancel()
    }
    searchUser(formData.value)
  }

  async function handleInsertMeetingRoom() {
    try {
      await createMeetingRoomApi(modalFormData)
      message.success('创建成功')
      return true
    }catch(e) {
      return false
    }
  }

  async function handleUpdateMeetingRoom() {
    try {
      await updateMeetingRoomApi({
        ...modalFormData,
        id: updateId.value!
      })
      message.success('更新成功')
      return true
    }catch(e) {
      return false
    }finally {
      updateId.value = null
    }
  }

  onBeforeMount(() => {
    searchUser({})
  })

  return {
    formData,
    columns,
    modalOpen,
    dataSource,
    modalTitle,
    modalFormData,
    searchUser,
    handleDelete,
    handleOpenModal,
    handleModalOk,
    handleModalCancel,
    handleEdit,
  }
}
