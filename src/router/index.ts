import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import UserLogin from '@/views/user/UserLogin.vue'
import UserRegister from '@/views/user/UserRegister.vue'
import UserManage from '@/views/admin/UserManage.vue'
import AddPicture from '@/views/picture/AddPicture.vue'
import PictureManage from '@/views/picture/PictureManage.vue'
import PictureDetail from '@/views/picture/PictureDetail.vue'
import SpaceManage from '@/views/space/SpaceManage.vue'
import AddSpace from '@/views/space/AddSpace.vue'
import SpaceDetail from '@/views/space/SpaceDetail.vue'
import UserSpace from '@/views/space/UserSpace.vue'
import AddPictureBatch from '@/views/picture/AddPictureBatch.vue'
import SearchPicture from '@/views/picture/SearchPicture.vue'
import SpaceAnalyze from '@/views/space/SpaceAnalyze.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLogin,
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegister,
    },
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: UserManage,
    },
    {
      path: '/add_picture',
      name: '创建图片',
      component: AddPicture,
    },
    {
      path: '/admin/pictureManage',
      name: '图片管理',
      component: PictureManage,
    },
    {
      path: '/picture/:id',
      name: '图片详情',
      component: PictureDetail,
      props: true,
    },
    {
      path: '/add_picture/batch',
      name: '批量创建图片',
      component: AddPictureBatch,
    },
    {
      path: '/admin/spaceManage',
      name: '空间管理',
      component: SpaceManage,
    },
    {
      path: '/add_space',
      name: '创建空间',
      component: AddSpace,
    },
    {
      path: '/my_space',
      name: '我的空间',
      component: UserSpace,
    },
    {
      path: '/space/:id',
      name: '空间详情',
      component: SpaceDetail,
      props: true,
    },
    {
      path: '/search_picture',
      name: '图片搜索',
      component: SearchPicture,
    },
    {
      path: '/space_analyze',
      name: '空间分析',
      component: SpaceAnalyze,
    }
  ],
})
export default router
