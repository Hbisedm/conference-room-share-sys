<template>
 <div class="p-20px">
        <Form
              name="search"
              layout='inline'
              :colon="false"
          >
              <FormItem label="会议室名称" name="name">
                  <Input v-model:value="formData.name" />
              </FormItem>

              <FormItem label="容纳人数" name="capacity">
                  <Input v-model:value="formData.capacity" />
              </FormItem>

              <FormItem label="设备" name="equipment">
                  <Input v-model:value="formData.equipment"/>
              </FormItem>

              <FormItem>
                  <Button type="primary" @click="() => searchUser(formData)">
                      搜索用户
                  </Button>
              </FormItem>
        </Form>
        <Table :columns="columns" :dataSource="dataSource" :pagination=" { pageSize: 10 }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'isBooked'">
                  <div>{{ record.isFrozen ? '已被预订' : '可预订' }}</div>
                </template>
                <template v-else-if="column.key === 'action'">
                  <Button text @click="() => handleBooking(record as Meeting.MeetingRoomSearchResult)">预订</Button>
                </template>
              </template>
        </Table>

        <Modal
          :title="modalTitle"
          :open="modalOpen"
          :visible="modalOpen"
          :onOk="handleModalOk"
          :onCancel="handleModalCancel">

            <Form
              ref="formRef"
              v-bind='layout'
              :colon="false"
            >
            <FormItem label="会议室名称" name="meetingRoomName">
                <span>{{ displayData.name }}</span>
            </FormItem>

            <FormItem label="预订开始日期" name="rangeStartDate">
                <DatePicker  v-model:value="displayData.rangeStartDate" />
            </FormItem>

            <FormItem label="预订开始时间" name="rangeStartTime" >
                <TimePicker  v-model:value="displayData.rangeStartTime" />
            </FormItem>

            <FormItem label="预订结束日期" name="rangeEndDate">
                <DatePicker v-model:value="displayData.rangeEndDate"  />
            </FormItem>

            <FormItem label="预订结束时间" name="rangeEndTime">
                <TimePicker  v-model:value="displayData.rangeEndTime" />
            </FormItem>

            <FormItem label="备注" name="note">
                <Input v-model:value="displayData.note"/>
            </FormItem>

      </Form>

      </Modal>
    </div>
</template>

<script setup lang="tsx">
import { Button, Form, FormItem, Input, TimePicker, DatePicker, Table, Modal  } from "ant-design-vue";
import {useMeetingRoomManageLogic} from './logic';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

const {
  formData,
  columns,
  dataSource,
  modalOpen,
  formRef,
  displayData,
  modalFormData,
  modalTitle,
  searchUser,
  handleOpenModal,
  handleModalOk,
  handleModalCancel,
  handleBooking,
} = useMeetingRoomManageLogic();





</script>
<route lang="yaml">
meta:
  layout: client
</route>
