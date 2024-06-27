<template>
  <main class="h-100vh flex flex-col">
    <TheHeader></TheHeader>
    <div class="flex">
      <TheMenu type="client"></TheMenu>
      <RouterView />
    </div>
  </main>
</template>
