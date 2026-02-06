import { LevelData } from '../types'
import Taro from '@tarojs/taro'

// 根据平台返回正确的图片路径
const getImagePath = (filename: string): string => {
  // H5 使用 import，小程序使用相对路径
  if (process.env.TARO_ENV === 'h5') {
    // H5 环境下，图片会被打包，这里返回静态路径
    return `/cat-action/assets/images/levels/${filename}`
  }
  // 小程序环境
  return `/assets/images/levels/${filename}`
}

// 关卡数据 - 猫咪位置需要根据实际图片调整
// 坐标为百分比 (0-100)，radius 为点击判定半径（百分比）
export const levels: LevelData[] = [
  {
    levelId: 1,
    name: '温馨客厅',
    background: getImagePath('level1.jpg'),
    difficulty: 'easy',
    hints: 3,
    cats: [
      // 1. 橘猫从沙发靠垫后面探出 (只露耳朵和眼睛)
      { id: 'cat_1', x: 30, y: 55, radius: 8 },
      // 2. 灰猫在书架上睡觉，融入书脊
      { id: 'cat_2', x: 75, y: 30, radius: 8 },
      // 3. 白猫躲在茶几下，部分可见
      { id: 'cat_3', x: 50, y: 75, radius: 10 },
    ]
  },
  {
    levelId: 2,
    name: '花园午后',
    background: getImagePath('level2.jpg'),
    difficulty: 'normal',
    hints: 3,
    cats: [
      // 1. 黑猫剪影在树枝上，融入树叶
      { id: 'cat_1', x: 65, y: 20, radius: 8 },
      // 2. 橘猫躲在花丛中，只露脸
      { id: 'cat_2', x: 25, y: 60, radius: 8 },
      // 3. 灰白猫在花园长椅上蜷缩睡觉
      { id: 'cat_3', x: 70, y: 55, radius: 10 },
      // 4. 虎斑猫躲在栅栏后，只露尾巴
      { id: 'cat_4', x: 85, y: 70, radius: 6 },
    ]
  },
  {
    levelId: 3,
    name: '书房秘密',
    background: getImagePath('level3.jpg'),
    difficulty: 'hard',
    hints: 2,
    cats: [
      // 1. 黑猫在高书架顶部，几乎隐入阴影
      { id: 'cat_1', x: 20, y: 15, radius: 6 },
      // 2. 灰猫蜷缩在打开的书桌抽屉里
      { id: 'cat_2', x: 45, y: 65, radius: 7 },
      // 3. 橘猫在皮椅上睡觉，融入皮革色
      { id: 'cat_3', x: 75, y: 50, radius: 8 },
      // 4. 白猫从窗帘后探出，只露胡须和眼睛
      { id: 'cat_4', x: 90, y: 35, radius: 5 },
      // 5. 小奶猫躲在地上散落的纸张下
      { id: 'cat_5', x: 35, y: 85, radius: 6 },
    ]
  }
]

export function getLevelById(levelId: number): LevelData | undefined {
  return levels.find(l => l.levelId === levelId)
}

export function getTotalLevels(): number {
  return levels.length
}
