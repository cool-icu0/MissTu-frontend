<template>
  <div id="spaceManagePage">
    <a-flex justify="space-between">
      <h2>空间管理</h2>
      <a-space>
        <a-button type="primary" href="/add_space">+ 创建空间</a-button>
        <a-button type="primary" ghost href="/space_analyze?queryPublic=1">分析公共图库</a-button>
        <a-button type="primary" ghost href="/space_analyze?queryAll=1">分析全部空间</a-button>
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px" />
    <!-- 搜索表单 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="空间名称">
        <a-input v-model:value="searchParams.spaceName" placeholder="请输入空间名称" allow-clear />
      </a-form-item>
      <a-form-item name="spaceLevel" label="空间级别">
        <a-select
          v-model:value="searchParams.spaceLevel"
          style="min-width: 180px"
          placeholder="请选择空间级别"
          :options="SPACE_LEVEL_OPTIONS"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="空间类别" name="spaceType">
        <a-select
          v-model:value="searchParams.spaceType"
          :options="SPACE_TYPE_OPTIONS"
          placeholder="请输入空间类别"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="用户 id">
        <a-input v-model:value="searchParams.userId" placeholder="请输入用户 id" allow-clear />
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
        <!--空间级别-->
        <template v-if="column.dataIndex === 'spaceLevel'">
          <div>{{ SPACE_LEVEL_MAP[record.spaceLevel] }}</div>
        </template>
        <!-- 空间类别 -->
        <template v-if="column.dataIndex === 'spaceType'">
          <a-tag>{{ SPACE_TYPE_MAP[record.spaceType] }}</a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button type="primary" @click="openDrawer(record)">查看详细</a-button>
            <a-button type="primary" :href="`/space_analyze?spaceId=${record.id}`"> 分析</a-button>
            <a-button type="primary" :href="`/add_space?id=${record.id}`"> 编辑</a-button>
            <a-button danger @click="doDelete(record.id)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
    <!-- 抽屉 -->
    <a-drawer title="详细信息" :visible="drawerVisible" @close="drawerVisible = false" width="30%">
      <div>
        <a-descriptions title="空间信息" bordered layout="vertical">
          <a-descriptions-item label="空间名称">
            {{ currentRecord?.spaceName }}
          </a-descriptions-item>
          <a-descriptions-item label="空间级别">
            {{SPACE_LEVEL_MAP[currentRecord?.spaceLevel] }}
         </a-descriptions-item>
          <a-descriptions-item label="空间类别">
            <a-tag>{{ SPACE_TYPE_MAP[currentRecord?.spaceType] }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="用户 id">{{ currentRecord?.userId }}</a-descriptions-item>
          <a-descriptions-item label="创建时间"
            >{{ dayjs(currentRecord?.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </a-descriptions-item>
          <a-descriptions-item label="修改时间"
            >{{ dayjs(currentRecord?.editTime).format('YYYY-MM-DD HH:mm:ss') }}
          </a-descriptions-item>
          <a-descriptions-item label="空间使用信息">
            <div>
              大小：{{ formatSize(currentRecord?.totalSize) }} /
              {{ formatSize(currentRecord?.maxSize) }}
            </div>
            <div>数量：{{ currentRecord?.totalCount }} / {{ currentRecord?.maxCount }}</div>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-drawer>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { deleteSpaceUsingPost, listSpaceByPageUsingPost } from '@/api/spaceController.ts'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  SPACE_LEVEL_MAP,
  SPACE_LEVEL_OPTIONS,
  SPACE_TYPE_MAP,
  SPACE_TYPE_OPTIONS,
} from '@/constants/space.ts'
import { formatSize } from '@/utils'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 250,
    align:"center",
  },
  {
    title: '空间名称',
    dataIndex: 'spaceName',
    width: 300,
    align:"center",
  },
  {
    title: '空间级别',
    dataIndex: 'spaceLevel',
    width: 200,
    align:"center",
  },
  {
    title: '空间类别',
    dataIndex: 'spaceType',
    width: 200,
    align:"center",
  },
  {
    title: '操作',
    key: 'action',
  },
]
// 定义数据
const dataList = ref<API.Space[]>([])
const total = ref(0)
// 搜索条件
const searchParams = reactive<API.SpaceQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})
// 获取数据
const fetchData = async () => {
  const res = await listSpaceByPageUsingPost({
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
    showTotal: (total: number) => `共 ${total} 条`,
  }
})
// 表格变化之后，重新获取数据
const doTableChange = (page: any) => {
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
// 删除数据
const doDelete = async (id: string) => {
  if (!id) {
    return
  }
  const res = await deleteSpaceUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('删除失败')
  }
}

const drawerVisible = ref(false)
const currentRecord = ref<API.Space | null>(null)
//打开抽屉
const openDrawer = (record: API.Space) => {
  currentRecord.value = record
  drawerVisible.value = true
}
</script>
