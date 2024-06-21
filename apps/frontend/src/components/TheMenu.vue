<template>
  <div id="menu-container">
    <div className="menu-area">
      <AntdMenu
        v-model:selectedKeys="selectedKeys"
        :items="items"
        @click="handleClick"
        >
      </AntdMenu>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Menu as AntdMenu, MenuProps} from 'ant-design-vue'
import { Key } from 'ant-design-vue/es/_util/type';
import { MenuInfo } from 'ant-design-vue/es/menu/src/interface';

const router = useRouter()
const route = useRoute()

const items = ref<MenuProps['items']>([])
const selectedKeys = ref<Key[]>(['userManage'])

function handleClick({keyPath, key}: MenuInfo) {
  selectedKeys.value = keyPath!
  router.replace(`${key}`)
}

const targetKey = route.fullPath
selectedKeys.value =[targetKey]

const props = defineProps<{ type: string }>()

const modules = import.meta.glob('~/constants/*.ts')

/** 目标路由名称 */
const targetModule = Object.keys(modules).find(key => {
  return key.includes(props.type)
})

modules[targetModule!]().then((res: any) => {
  nextTick(() => {
    /** 排序 */
    const sortedEntries = Object.entries(res.default).sort((a: any, b: any) => a[1].sort - b[1].sort);
    const sortedData = Object.fromEntries(sortedEntries) as {
      [key: string]: any
    };
    /** 生成菜单数据 */
    Object.keys(sortedData).forEach(key => {
      const item = sortedData[key]
      items.value!.push({
        key: item.url,
        label: item.name
      })
    })
  })
})
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
