<script setup lang="ts">
import { Button, Form, FormItem, Input, InputPassword } from 'ant-design-vue'
import { useRegister } from './useRegister'
import { useGotoPage } from '~/composables/useGotoPage'

const { formValue, onFinish, sendCaptcha } = useRegister()
const layout1 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

const layout2 = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
}
const { replaceLoginPage } = useGotoPage()
</script>

<template>
  <div class="mx-auto mb-0 mt-20 w-100 text-center">
    <h1>
      会议室预订系统
    </h1>
    <Form v-bind="layout1" :model="formValue" autocomplete="off" @finish="onFinish">
      <FormItem label="用户名" name="username" :rules="[{ required: true, message: 'Please input your username!' }]">
        <Input v-model:value="formValue.username" />
      </FormItem>
      <FormItem label="昵称" name="nickName" :rules="[{ required: true, message: 'Please input your username!' }]">
        <Input v-model:value="formValue.nickName" />
      </FormItem>
      <FormItem label="密码" name="password" :rules="[{ required: true, message: 'Please input your username!' }]">
        <InputPassword v-model:value="formValue.password" />
      </FormItem>
      <FormItem label="确认密码" name="confirmPassword" :rules="[{ required: true, message: 'Please input your username!' }]">
        <InputPassword v-model:value="formValue.confirmPassword" />
      </FormItem>
      <FormItem label="邮箱" name="email" :rules="[{ required: true, message: 'Please input your email!' }, { type: 'email', message: '请输入合法邮箱地址!' }]">
        <Input v-model:value="formValue.email" />
      </FormItem>
      <div class="flex justify-end">
        <FormItem
          label="验证码"
          name="captcha"
          :rules="[{ required: true, message: '请输入验证码!' }]"
        >
          <Input v-model:value="formValue.captcha" />
        </FormItem>
        <Button type="primary" @click="sendCaptcha">
          发送验证码
        </Button>
      </div>
      <FormItem v-bind="layout2">
        <div class="flex justify-end">
          已有账号？去<a @click="replaceLoginPage">登录</a>
        </div>
      </FormItem>
      <FormItem
        v-bind="layout2"
      >
        <Button class="w-full" type="primary" html-type="submit">
          注册
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<route>
{
    meta: {
        layout: 'no'
    }
}
</route>
