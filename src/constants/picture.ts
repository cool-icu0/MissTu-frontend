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
export const PIC_REVIEW_STATUS_OPTIONS = Object.entries(PIC_REVIEW_STATUS_MAP).map(([key, label]) => {
  return {
    label,
    value: parseInt(key, 10), // 将键转换为数字
  }
})
