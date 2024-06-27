<template>
  <div class="p-20px">
     <Form
          name="search"
          layout='inline'
          :colon="false"
      >
          <FormItem label="会议室名称" name="meetingRoomName">
              <Input v-model:value="formData.meetingRoomName" />
          </FormItem>

          <FormItem label="预订开始日期" name="rangeStartDate">
              <DatePicker v-model:value="formData.rangeStartDate" />
          </FormItem>

          <FormItem label="预订开始时间" name="rangeStartTime">
              <TimePicker v-model:value="formData.rangeStartTime" />
          </FormItem>

          <FormItem label="预订结束日期" name="rangeEndDate">
              <DatePicker v-model:value="formData.rangeEndDate" />
          </FormItem>

          <FormItem label="预订结束时间" name="rangeEndTime">
              <TimePicker v-model:value="formData.rangeEndTime" />
          </FormItem>

          <FormItem label="位置" name="meetingRoomPosition">
              <Input v-model:value="formData.meetingRoomPosition" />
          </FormItem>

          <FormItem>
            <Button type="primary" @click="() => searchBooking(formData)">
                搜索预订历史
            </Button>
          </FormItem>
    </Form>
     <Table :columns="columns" :dataSource="bookingSearchResult" :pagination=" {
         current: pageConfig.pageNo,
         pageSize: pageConfig.pageSize,
         onChange: changePage
      }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <Popconfirm title="解除申请" description="是否解除？" @confirm="() => handleUnbind(record.id)" ok-text="确认" cancel-text="取消">
              <a href="#">解除预订</a>
            </Popconfirm>
          </template>
        </template>
      </Table>

  </div>
</template>

<script setup lang="ts">
import { Button, Form, FormItem, Popconfirm, Input, TimePicker, DatePicker, Table, Modal  } from "ant-design-vue";
import { useBookingManageLogic } from './logic';


const {
  bookingSearchResult,
  formData,
  columns,
  pageConfig,
  changePage,
  searchBooking,

  handleUnbind,
} = useBookingManageLogic()


</script>

<style scoped>

</style>
<route lang="yaml">
meta:
  layout: client
</route>
