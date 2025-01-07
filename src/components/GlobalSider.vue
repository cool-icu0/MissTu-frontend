<template>
  <div id="globalSider">
    <a-layout-sider
      v-if="loginUserStore.loginUser.id"
      width="200"
      breakpoint="lg"
      collapsed-width="50"
      v-model:collapsed="collapsed"
    >
      <a-menu
        mode="inline"
        :items="fold"
        @click="() => (collapsed = !collapsed)"
        v-if="!collapsed"
      />
      <a-menu
        mode="inline"
        :items="unfold"
        @click="() => (collapsed = !collapsed)"
        v-if="collapsed"
      >
      </a-menu>
      <a-menu
        v-model:selectedKeys="current"
        mode="inline"
        :items="menuItems"
        @click="doMenuClick"
      />
    </a-layout-sider>
  </div>
</template>
<script lang="ts" setup>
import { computed, h, ref, watchEffect } from 'vue'
import {
  PictureOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  TeamOutlined,
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { SPACE_TYPE_ENUM } from '@/constants/space.ts'
import { listMyTeamSpaceUsingPost } from '@/api/spaceUserController.ts'
import { message } from 'ant-design-vue'
import { listSpaceVoByPageUsingPost } from '@/api/spaceController.ts'

const collapsed = ref<boolean>(false)
const loginUserStore = useLoginUserStore()
// 菜单项
const fixedMenuItems = [
  {
    key: '/',
    icon: () => h(PictureOutlined),
    label: '公共图库',
  },
  // {
  //   key: '/my_space',
  //   label: '我的空间',
  //   icon: () => h(UserOutlined),
  // },
  {
    key: '/add_space',
    label: '创建空间',
    icon: () => h(TeamOutlined),
    children: [
      {
        key: '/add_space?type=' + SPACE_TYPE_ENUM.TEAM,
        label: '创建团队空间',
      },
      {
        key: '/add_space?type=' + SPACE_TYPE_ENUM.PRIVATE,
        label: '创建私有空间',
      },
    ],
  },
]

const unfold = [
  {
    icon: () => h(MenuUnfoldOutlined),
    label: '显示名称',
  },
]
const fold = [
  {
    icon: () => h(MenuFoldOutlined),
    label: '隐藏名称',
  },
]
const router = useRouter()
// 当前要高亮的菜单项
const current = ref<string[]>([])
// 监听路由变化，更新高亮菜单项
router.afterEach((to, from, next) => {
  current.value = [to.path]
})
// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}

const teamSpaceList = ref<API.SpaceUserVO[]>([])
const privateSpaceList = ref<API.SpaceVO[]>([])

const menuItems = computed(() => {
  // 没有团队空间或私有空间，只展示固定菜单
  if (teamSpaceList.value.length < 1 && privateSpaceList.value.length < 1) {
    return fixedMenuItems
  }
  // 展示团队和私有空间分组
  const teamSpaceSubMenus = teamSpaceList.value.map((spaceUser) => {
    const space = spaceUser.space
    return {
      key: '/space/' + spaceUser.spaceId,
      label: space?.spaceName,
    }
  })
  const teamSpaceMenuGroup = {
    type: 'group',
    label: '我的团队',
    key: 'teamSpace',
    children: teamSpaceSubMenus,
  }

  const privateSpaceSubMenus = privateSpaceList.value.map((item) => {
    return {
      key: '/space/' + item.id,
      label: item.spaceName,
    }
  })
  const privateSpaceMenuGroup = {
    type: 'group',
    label: '我的私有空间',
    key: 'privateSpace',
    children: privateSpaceSubMenus,
  }
  return [...fixedMenuItems,privateSpaceMenuGroup, teamSpaceMenuGroup]
})

// 加载团队空间列表
const fetchTeamSpaceList = async () => {
  const res = await listMyTeamSpaceUsingPost()
  if (res.data.code === 0 && res.data.data) {
    teamSpaceList.value = res.data.data
  } else {
    message.error('加载我的团队空间失败，' + res.data.message)
  }
}
// 加载私有空间列表
const fetchprivateSpaceList = async ()=>{
  const res = await listSpaceVoByPageUsingPost({
    userId: loginUserStore.loginUser.id,
    current: 1,
    pageSize: 19,
    spaceType:SPACE_TYPE_ENUM.PRIVATE,
  })
  if (res.data.code === 0 && res.data.data) {
    privateSpaceList.value = res.data.data?.records
  } else {
    message.error('加载我的私有空间失败，' + res.data.message)
  }
}

/**
 * 监听变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  // 登录才加载
  if (loginUserStore.loginUser.id) {
    fetchTeamSpaceList()
    fetchprivateSpaceList()
  }
})
</script>
<style scoped>
#globalSider .ant-layout-sider {
  background: none;
}
</style>
