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
                  <Button type="primary" @click="() => handleOpenModal()" :style="{background: 'green'}">
                      添加会议室
                  </Button>
              </FormItem>
        </Form>
        <Table :columns="columns" :dataSource="dataSource" :pagination=" {
                pageSize: 10
            }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'isBooked'">
                  <div>{{ record.isFrozen ? '已被预订' : '可预订' }}</div>
                </template>
                <template v-else-if="column.key === 'action'">
                  <Button text @click="() => handleEdit(record as Meeting.MeetingRoomSearchResult)">更新</Button>
                  <Button text @click="() => handleDelete(record.id)">删除</Button>
                </template>
              </template>
        </Table>
        <Modal
          :title="modalTitle"
          :open="modalOpen"
          :visible="modalOpen"
          :onOk="handleModalOk"
          :onCancel="handleModalCancel"
        >
           <Form
            :model="modalFormData"
            :colon="false"
            v-bind="layout"
        >
            <FormItem
                label="会议室名称"
                name="name"
                :rules="[
                    { required: true, message: '请输入会议室名称!' },
                ]"
            >
                <Input v-model:value="modalFormData.name" />
            </FormItem>
            <FormItem
                label="位置"
                name="location"
                :rules="[
                    { required: true, message: '请输入会议室位置!' },
                ]"
            >
                <Input v-model:value="modalFormData.location" />
            </FormItem>
            <FormItem
                label="容纳人数"
                name="capacity"
                :rules="[
                    { required: true, message: '请输入会议室容量!' },
                ]"
            >
                <InputNumber v-model:value="modalFormData.capacity" />
            </FormItem>
            <FormItem
                label="设备"
                name="equipment"
            >
                <Input v-model:value="modalFormData.equipment" />
            </FormItem>
            <FormItem
                label="描述"
                name="description"
            >
                <Textarea v-model:value="modalFormData.description" />
            </FormItem>
        </Form>
        </Modal>
    </div>
</template>

<script setup lang="tsx">
import { Button, Form, FormItem, Input, InputNumber, Textarea, Table, Modal  } from "ant-design-vue";
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
  modalFormData,
  modalTitle,
  searchUser,
  handleDelete,
  handleOpenModal,
  handleEdit,
  handleModalOk,
  handleModalCancel,
} = useMeetingRoomManageLogic();




</script>


<route lang="yaml">
meta:
  layout: main
</route>

