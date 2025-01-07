export const PIC_REVIEW_STATUS_ENUM = {
  REVIEWING: 0,
  PASS: 1,
  REJECT: 2,
}

export const PIC_REVIEW_STATUS_MAP = {
  [PIC_REVIEW_STATUS_ENUM.REVIEWING]: '待审核',
  [PIC_REVIEW_STATUS_ENUM.PASS]: '通过',
  [PIC_REVIEW_STATUS_ENUM.REJECT]: '拒绝',
}

// 使用枚举值作为键的类型
export const PIC_REVIEW_STATUS_OPTIONS = Object.entries(PIC_REVIEW_STATUS_MAP).map(
  ([key, label]) => {
    return {
      label,
      value: parseInt(key, 10), // 将键转换为数字
    }
  },
)

/**
 * 图片编辑消息类型枚举
 */
export const PICTURE_EDIT_MESSAGE_TYPE_ENUM = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  ENTER_EDIT: 'ENTER_EDIT',
  EXIT_EDIT: 'EXIT_EDIT',
  EDIT_ACTION: 'EDIT_ACTION',
}
/**
 * 图片编辑消息类型映射
 */
export const PICTURE_EDIT_MESSAGE_TYPE_MAP = {
  INFO: '发送通知',
  ERROR: '发送错误',
  ENTER_EDIT: '进入编辑状态',
  EXIT_EDIT: '退出编辑状态',
  EDIT_ACTION: '执行编辑操作',
}
/**
 * 图片编辑操作枚举
 */
export const PICTURE_EDIT_ACTION_ENUM = {
  ZOOM_IN: 'ZOOM_IN',
  ZOOM_OUT: 'ZOOM_OUT',
  ROTATE_LEFT: 'ROTATE_LEFT',
  ROTATE_RIGHT: 'ROTATE_RIGHT',
}
/**
 * 图片编辑操作映射
 */
export const PICTURE_EDIT_ACTION_MAP = {
  ZOOM_IN: '放大操作',
  ZOOM_OUT: '缩小操作',
  ROTATE_LEFT: '左旋操作',
  ROTATE_RIGHT: '右旋操作',
}
