import { LevelData } from '../types'

// 测试关卡数据
export const levels: LevelData[] = [
  {
    levelId: 1,
    name: '温馨客厅',
    background: '/assets/images/levels/living_room.png',
    difficulty: 'easy',
    hints: 3,
    cats: [
      { id: 'cat_1', x: 25, y: 60, radius: 30 },
      { id: 'cat_2', x: 70, y: 35, radius: 25 },
      { id: 'cat_3', x: 50, y: 80, radius: 28 },
    ]
  },
  {
    levelId: 2,
    name: '花园午后',
    background: '/assets/images/levels/garden.png',
    difficulty: 'easy',
    hints: 3,
    cats: [
      { id: 'cat_1', x: 15, y: 45, radius: 25 },
      { id: 'cat_2', x: 80, y: 20, radius: 22 },
      { id: 'cat_3', x: 45, y: 70, radius: 28 },
      { id: 'cat_4', x: 60, y: 50, radius: 20 },
    ]
  },
  {
    levelId: 3,
    name: '书房秘密',
    background: '/assets/images/levels/study.png',
    difficulty: 'normal',
    hints: 2,
    cats: [
      { id: 'cat_1', x: 10, y: 30, radius: 20 },
      { id: 'cat_2', x: 85, y: 65, radius: 22 },
      { id: 'cat_3', x: 35, y: 85, radius: 25 },
      { id: 'cat_4', x: 55, y: 15, radius: 18 },
      { id: 'cat_5', x: 70, y: 45, radius: 20 },
    ]
  }
]

export function getLevelById(levelId: number): LevelData | undefined {
  return levels.find(l => l.levelId === levelId)
}

export function getTotalLevels(): number {
  return levels.length
}
