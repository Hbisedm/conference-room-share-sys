<template>
 <div class="p-20px">
        <div className="userManage-form">
            <Form
                name="search"
                layout='inline'
                :colon="false"
            >
                <FormItem label="用户名" name="username">
                    <Input v-model:value="formData.username"/>
                </FormItem>

                <FormItem label="昵称" name="nickName">
                    <Input v-model:value="formData.nickName" />
                </FormItem>

                <FormItem label="邮箱" name="email" :rules="[
                    { type: 'email', message: '请输入合法邮箱地址!'}
                ]">
                    <Input v-model:value="formData.email"/>
                </FormItem>

                <FormItem>
                    <Button type="primary" @click="() => searchUser(formData)">
                        搜索用户
                    </Button>
                </FormItem>
            </Form>
        </div>
        <div className="userManage-table">
          <Table :columns="columns" :dataSource="dataSource" :pagination=" {
                pageSize: 10
            }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'headPic'">
                  <Image v-if="record.headPic" :src="`${VITE_BASE_URL}${record.headPic}`" width="50" height="100px"></Image>
                  <div v-else>/</div>
                </template>
                <template v-else-if="column.key === 'isFrozen'">
                  <div>{{ record.isFrozen ? '冻结' : '正常' }}</div>
                </template>
                <template v-else-if="column.key === 'action'">
                  <Button text @click="handleFreezeUser(record.id)">冻结</Button>
                  </template>
              </template>
            </Table>
        </div>
    </div>
</template>

<script setup lang="tsx">
import { Button, Form, FormItem, Input, Table, Image, message  } from "ant-design-vue";
import { ColumnsType } from "ant-design-vue/es/table";
import { userListApi, freezeUserApi }  from '~/api/userManage'

const { VITE_BASE_URL } = useEnv()

const formData = ref({
    username: '',
    nickName: '',
    email: ''
})

const columns: ColumnsType<ApiUser.UserSearchResult> = [
    {
        title: '用户名',
        dataIndex: 'username'
    },
    {
        title: '头像',
        key: 'headPic',
    },
    {
        title: '昵称',
        dataIndex: 'nickName'
    },
    {
        title: '邮箱',
        dataIndex: 'email'
    },
    {
        title: '注册时间',
        dataIndex: 'createTime'
    },
    {
        title: '状态',
        key: 'isFrozen',
    },
    {
      title: '操作',
      key: 'action',
    }
];

const dataSource = ref<ApiUser.UserSearchResult[]>([])


async function searchUser({ username = '', nickName = '', email ='' }){
  console.log('搜索用户', username, nickName, email)

  const {data} = await userListApi({
    username,
    nickName,
    email,
    pageNo: 1,
    pageSize: 10,
  })

  dataSource.value = data.users

}

async function handleFreezeUser(userId: number){
  console.log('冻结用户', userId);
  await freezeUserApi({userId})
  message.success('冻结成功');
  await searchUser({
    ...formData.value
  })

}

onBeforeMount(() => {
  searchUser({})
})


</script>

<route lang="yaml">
meta:
  layout: main
</route>
