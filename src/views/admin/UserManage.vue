<template>
  <div id="userManagePage">
    <!-- 搜索表单 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="账号">
        <a-input v-model:value="searchParams.userAccount" placeholder="输入账号" allow-clear />
      </a-form-item>
      <a-form-item label="用户名">
        <a-input v-model:value="searchParams.userName" placeholder="输入用户名" allow-clear />
      </a-form-item>
      <a-form-item label="角色">
        <a-select
          v-model:value="searchParams.userRole"
          placeholder="选择角色"
          allow-clear
        >
          <a-select-option value="admin">管理员</a-select-option>
          <a-select-option value="user">普通用户</a-select-option>
          <!-- 可以根据需要添加更多的角色选项 -->
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>
    <div style="margin-bottom: 16px" />
    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-image :src="record.userAvatar" :width="120" />
        </template>
        <template v-else-if="column.dataIndex === 'userRole'">
          <div v-if="record.userRole === 'admin'">
            <a-tag color="green">管理员</a-tag>
          </div>
          <div v-else>
            <a-tag color="blue">普通用户</a-tag>
          </div>
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">

          <a-button type="primary" @click="showEditModal(record.id)">修改</a-button>

          <span width="20px">&nbsp;&nbsp;&nbsp;</span>

          <a-popconfirm
            danger
            v-if="dataList.length"
            title="确认删除该条数据?"
            ok-text="确认"
            cancel-text="取消"
            @confirm="doDelete(record.id)"
          >
            <a-button danger>删除</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <!-- 编辑用户信息的模态框 -->
    <a-modal
      v-model:visible="editModalVisible"
      title="编辑用户信息"
      @ok="handleEditModalOk"
      @cancel="handleEditModalCancel"
    >
      <a-form :model="editUser">
        <a-form-item label="账号">
          <a-input v-model:value="editUser.userAccount" disabled />
        </a-form-item>
        <a-form-item label="用户名">
          <a-input v-model:value="editUser.userName" />
        </a-form-item>
        <a-form-item label="头像">
          <a-input v-model:value="editUser.userAvatar" />
        </a-form-item>
        <a-form-item label="简介">
          <a-input v-model:value="editUser.userProfile" />
        </a-form-item>
        <a-form-item label="用户角色">
          <a-select v-model:value="editUser.userRole">
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="user">普通用户</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  deleteUserUsingPost,
  listUserVoByPageUsingPost,
  updateUserUsingPost,
} from '@/api/userController.ts'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
const editModalVisible = ref(false) // 控制编辑模态框的显示
let editUser:API.UserVO = reactive({
  id: 0,
  userAccount: '',
  userName: '',
  userAvatar: '',
  userProfile: '',
  userRole: '',
  // createTime:''
})
interface Page{
  current:1,
  pageSize:10,
}

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]
// 定义数据
const dataList = ref<API.UserVO[]>([])
const total = ref(0)
// 搜索条件
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'ascend',
})
// 获取数据
const fetchData = async () => {
  const res = await listUserVoByPageUsingPost({
    ...searchParams,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}
// 页面加载时获取数据，请求一次
onMounted(() => {
  fetchData()
})
// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total:number) => `共 ${total} 条`,
  }
})
// 表格变化之后，重新获取数据
const doTableChange = (page: Page) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}
// 搜索数据
const doSearch = () => {
  // 重置页码
  searchParams.current = 1
  fetchData()
}
//修改数据
// 显示编辑模态框，并填充数据
const showEditModal = (id: number) => {
  console.log('dataList', dataList.value)
  for (const key in dataList.value) {
    if (dataList.value[key].id === id) {
      editUser = dataList.value[key]
    }
  }
  editModalVisible.value = true
}
// 处理编辑模态框的确认事件
const handleEditModalOk = () => {
  doChange(editUser)
  editModalVisible.value = false
}

// 处理编辑模态框的取消事件
const handleEditModalCancel = () => {
  editModalVisible.value = false
}
//修改数据
const doChange = async (editUser: API.User) => {
  const res = await updateUserUsingPost(editUser)
  if (res.data.code === 0) {
    message.success('修改成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('修改失败')
  }
}
// 删除数据

const doDelete = async (id: number) => {
  if (!id) {
    return
  }
  const res = await deleteUserUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('删除失败')
  }
}
</script>
