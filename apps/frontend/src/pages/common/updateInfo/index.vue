<script setup lang="ts">
import { message, Button, Form, UploadDragger,  FormItem,  Input } from 'ant-design-vue'
import { InboxOutlined } from '@ant-design/icons-vue';
import { getUserInfo, updateUserInfo, updateUserInfoCaptcha } from '~/api';

import { useEnv } from '~/composables/useEnv'
const { VITE_BASE_URL } = useEnv()

interface UserInfo {
  headPic: string
  nickName: string
  email: string
  captcha: string
}

const layout1 = {
  labelCol: {span: 6},
  wrapperCol: {span: 18}
}

const formValue = ref<UserInfo>({
  captcha: '',
  email: "",
  headPic: '',
  nickName: ''
})


async function onFinish() {
  const {message: msg} = await updateUserInfo(formValue.value)
  message.success(msg)
}

async function sendCaptcha() {
const res = await updateUserInfoCaptcha()
    console.log(res)
    message.success(res.message)
}

async function query() {
      const res = await getUserInfo();
      const { data } = res
      console.log(data);
      formValue.value.email = data.email
      formValue.value.headPic = data.headPic
      formValue.value.nickName = data.nickName
}

onMounted(() => {
    query();
})

function handleChangeFile(info: any) {
   const { status } = info.file;
        if (status === 'done') {
            formValue.value.headPic = info.file.response.data
            message.success(`${info.file.name} 文件上传成功`);
        } else if (status === 'error') {
            message.error(`${info.file.name} 文件上传失败`);
        }
}

</script>


<template>
  <div class="mx-auto mb-0 mt-20 w-100 text-center">
    <h1>
      会议室预订系统
    </h1>
    <Form v-bind="layout1" :model="formValue" autocomplete="off" @finish="onFinish">
      <FormItem label="头像" name="headPic" :rules="[{ required: true, message: '请选择头像' }]">
        <img class="w-100px h-100px mb-10px" :src="VITE_BASE_URL + formValue.headPic" alt="头像" />
        <UploadDragger
          name="file"
          :action="VITE_BASE_URL + 'user/upload'"
          @change="handleChangeFile"
        >
        <p class="ant-upload-drag-icon">
      <inbox-outlined></inbox-outlined>
    </p>
    <p class="ant-upload-text">Click or drag file to this area to upload</p>

      </UploadDragger>

      </FormItem>
      <FormItem label="昵称" name="nickName" :rules="[{ required: true, message: '请输入你的昵称' }]">
        <Input v-model:value="formValue.nickName" />
      </FormItem>
      <FormItem label="邮箱" name="email" :rules="[{ required: true, message: 'Please input your email!' }, { type: 'email', message: '请输入合法邮箱地址!' }]">
        <Input v-model:value="formValue.email" disabled />
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
      <FormItem v-bind="layout1">
        <Button class="w-full ml-100px" type="primary" html-type="submit">
          修改
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<route lang="yaml">
meta:
  layout: update-info
</route>
