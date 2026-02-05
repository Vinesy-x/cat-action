import { SaveData } from '../types'
import Taro from '@tarojs/taro'

const SAVE_KEY = 'cat_action_save'

// 默认存档
const defaultSave: SaveData = {
  unlockedLevels: [1],
  completedLevels: {},
  totalCatsFound: 0
}

// 读取存档
export function loadSave(): SaveData {
  try {
    const data = Taro.getStorageSync(SAVE_KEY)
    if (data) {
      return JSON.parse(data) as SaveData
    }
  } catch (e) {
    console.error('读取存档失败:', e)
  }
  return { ...defaultSave }
}

// 保存存档
export function saveSave(data: SaveData): void {
  try {
    Taro.setStorageSync(SAVE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('保存存档失败:', e)
  }
}

// 解锁关卡
export function unlockLevel(levelId: number): void {
  const save = loadSave()
  if (!save.unlockedLevels.includes(levelId)) {
    save.unlockedLevels.push(levelId)
    saveSave(save)
  }
}

// 完成关卡
export function completeLevel(levelId: number, time: number, catsFound: number): void {
  const save = loadSave()
  
  const existing = save.completedLevels[levelId]
  if (!existing || time < existing.bestTime) {
    save.completedLevels[levelId] = {
      bestTime: time,
      foundAllCats: true
    }
  }
  
  save.totalCatsFound += catsFound
  
  // 解锁下一关
  unlockLevel(levelId + 1)
  
  saveSave(save)
}

// 检查关卡是否解锁
export function isLevelUnlocked(levelId: number): boolean {
  const save = loadSave()
  return save.unlockedLevels.includes(levelId)
}
