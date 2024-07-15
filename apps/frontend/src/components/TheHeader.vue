<script setup lang="ts">
import { Modal } from 'ant-design-vue';

import { useUserStore } from '~/store';


  const { pushUpdateInfoPage } = useGotoPage()
  const { handleToHome } = gotoHome()
  const userStore = useUserStore()

  function handleLogout() {
    Modal.confirm({
      title: '提示',
      content: '请确认退出登录吗',
      cancelText: '取消',
      okText: '确认',
      onOk: () => {
        userStore.logout()
      },
    })
  }

</script>

<template>
    <div class="min-h-80px max-h-80px flex items-center justify-between border-b-1px border-b-#aaa border-b-solid px-20px">
      <h1 m-0 decoration-none @click="handleToHome">
        会议室预定系统
      </h1>
      <div class="flex items-center">
        <button class="mr-10px border-none bg-transparent text-blue hover:cursor-pointer" @click="() => handleLogout()">退出</button>
        <div class="text-40px" i-carbon-information @click="pushUpdateInfoPage" />
      </div>
    </div>
</template>


