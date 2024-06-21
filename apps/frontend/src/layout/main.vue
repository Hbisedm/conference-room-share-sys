<script setup lang="ts">
const { pushUpdateInfoPage, pushHomePage } = useGotoPage()

</script>

<template>
  <main class="h-100vh flex flex-col">
    <div class="h-80px flex items-center justify-between border-b-1px border-b-#aaa border-b-solid px-20px">
      <h1 m-0 decoration-none @click="pushHomePage">
        会议室预定系统
      </h1>
      <div class="text-40px" i-carbon-information @click="pushUpdateInfoPage" />
    </div>
    <div class="flex">
      <TheMenu type="main"></TheMenu>
      <RouterView />
  </div>
  </main>
</template>
