<template>
  <div id="menu-container">
    <div className="menu-area">
    <AntdMenu
      v-model:selectedKeys="theMenu"
      :items="items"
      @click="handleClick"
      >
    </AntdMenu>
  </div>
  </div>
</template>

<script setup lang="ts">
import {Menu as AntdMenu, MenuProps} from 'ant-design-vue'
import { MenuInfo } from 'ant-design-vue/es/menu/src/interface';

const theMenu = ref(['userManage'])
const router = useRouter()

function handleClick({keyPath, key}: MenuInfo) {
  theMenu.value = keyPath!
  router.push(`/${key}`)
}

const items: MenuProps['items'] = [{
  key: '1',
  label: '会议室管理',
},
{
  key: '2',
  label: '预订管理',
},
{
  key: 'userManage',
  label: '用户管理',
},
{
  key: '4',
  label: '统计',
}]
</script>

<style scoped>

#menu-container {
    display: flex;
    flex-direction: row;
}
#menu-container .menu-area {
    width: 200px;
}

</style>
