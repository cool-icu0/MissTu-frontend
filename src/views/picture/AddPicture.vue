<template>
  <div id="addPicturePage">
    <h2 style="margin-bottom: 16px">
      {{ route.query?.id ? '修改图片' : '创建图片' }}
    </h2>
    <a-typography-paragraph v-if="spaceId" type="secondary">
      保存至空间：<a :href="`/space/${spaceId}`" target="_blank">{{ spaceId }}</a>
    </a-typography-paragraph>
    <!-- 选择上传方式 -->
    <a-tabs v-model:activeKey="uploadType"
      >>
      <a-tab-pane key="file" tab="文件上传">
        <!-- 图片上传组件 -->
        <PictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess" />
      </a-tab-pane>
      <a-tab-pane key="url" tab="URL 上传" force-render>
        <UrlPictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess" />
      </a-tab-pane>
    </a-tabs>
    <!-- 图片信息表单 -->
    <a-form v-if="picture" layout="vertical" :model="pictureForm" @finish="handleSubmit">
      <a-form-item label="名称" name="name">
        <a-input v-model:value="pictureForm.name" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="简介" name="introduction">
        <a-textarea
          v-model:value="pictureForm.introduction"
          placeholder="请输入简介"
          :rows="2"
          autoSize
          allowClear
        />
      </a-form-item>
      <a-form-item label="分类" name="category">
        <a-auto-complete
          v-model:value="pictureForm.category"
          :options="categoryOptions"
          placeholder="请输入分类"
          allowClear
        />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="pictureForm.tags"
          :options="tagOptions"
          mode="tags"
          placeholder="请输入标签"
          allowClear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">创建</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import PictureUpload from '@/components/picture/PictureUpload.vue'
import { useRoute, useRouter } from 'vue-router'
import {
  editPictureUsingPost,
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet,
} from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import UrlPictureUpload from '@/components/picture/UrlPictureUpload.vue'

const pictureForm = reactive<API.PictureEditRequest>({})
const uploadType = ref<'file' | 'url'>('file')
const picture = ref<API.PictureVO>()
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}
// 空间 id
const spaceId = computed(() => {
  return route.query?.spaceId
})
const router = useRouter()
const route = useRoute()

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values) => {
  const pictureId = Number(picture.value.id)
  if (!pictureId) {
    return
  }
  const res = await editPictureUsingPost({
    id: pictureId,
    spaceId: spaceId.value,
    ...values,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('创建成功')
    // 跳转到图片详情页
    router.push({
      path: `/picture/${pictureId}`,
    })
  } else {
    message.error('创建失败，' + res.data.message)
  }
}

//分类和标签选择框
const categoryOptions = ref<string[]>([])
const tagOptions = ref<string[]>([])

// 获取标签和分类选项
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    // 转换成下拉选项组件接受的格式
    tagOptions.value = (res.data.data.tagList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
    categoryOptions.value = (res.data.data.categoryList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
  } else {
    message.error('加载选项失败，' + res.data.message)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})

// 获取老数据
const getOldPicture = async () => {
  // 获取数据
  const id = route.query?.id
  if (id) {
    const res = await getPictureVoByIdUsingGet({
      id: id,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      picture.value = data
      pictureForm.name = data.name
      pictureForm.introduction = data.introduction
      pictureForm.category = data.category
      pictureForm.tags = data.tags
    }
  }
}

onMounted(() => {
  getOldPicture()
})
</script>
<style scoped>
#addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
