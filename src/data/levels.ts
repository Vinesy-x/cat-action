import { LevelData } from '../types'

// 图片 CDN 地址（使用 GitHub raw）
const IMAGE_BASE = 'https://raw.githubusercontent.com/Vinesy-x/cat-action/main/src/assets/images/levels'

// 根据平台返回正确的图片路径
const getImagePath = (filename: string): string => {
  if (process.env.TARO_ENV === 'h5') {
    // H5 环境，使用相对路径
    return `/cat-action/assets/images/levels/${filename}`
  }
  // 小程序环境，使用网络图片
  return `${IMAGE_BASE}/${filename}`
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
      { id: 'cat_1', x: 30, y: 55, radius: 8 },
      { id: 'cat_2', x: 75, y: 30, radius: 8 },
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
      { id: 'cat_1', x: 65, y: 20, radius: 8 },
      { id: 'cat_2', x: 25, y: 60, radius: 8 },
      { id: 'cat_3', x: 70, y: 55, radius: 10 },
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
      { id: 'cat_1', x: 20, y: 15, radius: 6 },
      { id: 'cat_2', x: 45, y: 65, radius: 7 },
      { id: 'cat_3', x: 75, y: 50, radius: 8 },
      { id: 'cat_4', x: 90, y: 35, radius: 5 },
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
