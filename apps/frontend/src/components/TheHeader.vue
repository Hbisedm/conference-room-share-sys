<script setup lang="ts">
  const { pushUpdateInfoPage } = useGotoPage()
  const { handleToHome } = gotoHome()
</script>

<template>
    <div class="h-80px flex items-center justify-between border-b-1px border-b-#aaa border-b-solid px-20px">
      <h1 m-0 decoration-none @click="handleToHome">
        会议室预定系统
      </h1>
      <div class="flex items-center">
        <button class="mr-10px border-none bg-transparent text-blue" @click="handleLogout">退出</button>
        <div class="text-40px" i-carbon-information @click="pushUpdateInfoPage" />
      </div>
    </div>
</template>


