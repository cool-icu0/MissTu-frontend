import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/Home.vue'
import UserLoginPage from '@/views/user/UserLogin.vue'
import UserRegisterPage from '@/views/user/UserRegister.vue'
import UserManagePage from '@/views/admin/UserManage.vue'
import AddPicturePage from '@/views/picture/AddPicture.vue'
import PictureManagePage from '@/views/picture/PictureManage.vue'
import PictureDetailPage from '@/views/picture/PictureDetail.vue'
import AddPictureBatchPage from '@/views/picture/AddPictureBatchPage.vue'
import SpaceManagePage from '@/views/space/SpaceManage.vue'
import AddSpacePage from '@/views/space/AddSpace.vue'
import SpaceDetailPage from '@/views/space/SpaceDetail.vue'
import UserSpacePage from '@/views/space/UserSpace.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage,
    },
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: UserManagePage,
    },
    {
      path: '/add_picture',
      name: '创建图片',
      component: AddPicturePage,
    },
    {
      path: '/admin/pictureManage',
      name: '图片管理',
      component: PictureManagePage,
    },
    {
      path: '/picture/:id',
      name: '图片详情',
      component: PictureDetailPage,
      props: true,
    },
    {
      path: '/add_picture/batch',
      name: '批量创建图片',
      component: AddPictureBatchPage,
    },
    {
      path: '/admin/spaceManage',
      name: '空间管理',
      component: SpaceManagePage,
    },
    {
      path: '/add_space',
      name: '创建空间',
      component: AddSpacePage,
    },
    {
      path: '/my_space',
      name: '我的空间',
      component: UserSpacePage,
    },
    {
      path: '/space/:id',
      name: '空间详情',
      component: SpaceDetailPage,
      props: true,
    },
  ],
})
export default router
