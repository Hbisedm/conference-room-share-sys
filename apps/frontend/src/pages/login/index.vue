<script setup lang="ts">
import { Button, Form, FormItem, Input, InputPassword, Switch } from 'ant-design-vue'
import { useIndex } from './useIndex'
import { useGotoPage } from '~/composables/useGotoPage'

const { userInfo, onFinish, adminLoginChecked } = useIndex()

const layout1 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}
const layout2 = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
}
const { pushRegisterPage, pushUpdatePasswordPage } = useGotoPage()
</script>

<template>
  <div class="mx-auto mb-0 mt-20 w-100 text-center">
    <h1>
      会议室预订系统
    </h1>
    <Form v-bind="layout1" autocomplete="off" :model="userInfo" @finish="onFinish">
      <FormItem label="用户名" name="username" :rules="[{ required: true, message: 'Please input your username!' }]">
        <Input v-model:value="userInfo.username" />
      </FormItem>
      <FormItem label="密码" name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
        <InputPassword v-model:value="userInfo.password" />
      </FormItem>
      <FormItem v-bind="layout2">
        <div class="flex justify-between">
          <a @click="pushRegisterPage">创建账号</a>
          <Switch v-model:checked="adminLoginChecked"   checked-children="管理员登录" un-checked-children="用户登录"></Switch>
          <a @click="pushUpdatePasswordPage">忘记密码</a>
        </div>
      </FormItem>
      <FormItem v-bind="layout2">
        <Button class="w-full" type="primary" html-type="submit">
          登录
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<route lang="yaml">
meta:
  layout: no
</route>
