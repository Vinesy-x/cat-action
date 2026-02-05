// 关卡数据类型定义
export interface CatPosition {
  id: string
  x: number      // 相对于场景的 x 坐标 (0-100 百分比)
  y: number      // 相对于场景的 y 坐标 (0-100 百分比)
  radius: number // 点击判定半径 (像素)
  found?: boolean
}

export interface LevelData {
  levelId: number
  name: string
  background: string      // 背景图片路径
  cats: CatPosition[]     // 猫咪位置数组
  difficulty: 'easy' | 'normal' | 'hard'
  hints: number           // 可用提示次数
}

// 游戏状态
export interface GameState {
  currentLevel: number
  foundCats: string[]     // 已找到的猫咪 ID
  hintsRemaining: number
  isCompleted: boolean
  startTime: number
  endTime?: number
}

// 关卡进度存档
export interface SaveData {
  unlockedLevels: number[]
  completedLevels: Record<number, {
    bestTime: number
    foundAllCats: boolean
  }>
  totalCatsFound: number
}
