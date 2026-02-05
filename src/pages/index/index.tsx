import { View, Text } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { levels } from '../../data/levels'
import { loadSave, SaveData } from '../../utils/storage'
import LevelCard from '../../components/LevelCard/LevelCard'
import './index.scss'

export default function Index() {
  const [save, setSave] = useState<SaveData | null>(null)

  useEffect(() => {
    const data = loadSave()
    setSave(data)
  }, [])

  const handleLevelClick = (levelId: number) => {
    Taro.navigateTo({
      url: `/pages/game/index?levelId=${levelId}`
    })
  }

  if (!save) {
    return (
      <View className='loading'>
        <Text>加载中...</Text>
      </View>
    )
  }

  return (
    <View className='index'>
      {/* 标题 */}
      <View className='header'>
        <Text className='title'>🐱 猫咪行动</Text>
        <Text className='subtitle'>找到所有隐藏的猫咪！</Text>
      </View>

      {/* 统计 */}
      <View className='stats'>
        <View className='stat-item'>
          <Text className='stat-value'>{Object.keys(save.completedLevels).length}</Text>
          <Text className='stat-label'>已通关</Text>
        </View>
        <View className='stat-item'>
          <Text className='stat-value'>{save.totalCatsFound}</Text>
          <Text className='stat-label'>猫咪收集</Text>
        </View>
      </View>

      {/* 关卡列表 */}
      <View className='level-list'>
        <Text className='section-title'>选择关卡</Text>
        <View className='levels-grid'>
          {levels.map(level => (
            <LevelCard
              key={level.levelId}
              level={level}
              isUnlocked={save.unlockedLevels.includes(level.levelId)}
              isCompleted={!!save.completedLevels[level.levelId]}
              bestTime={save.completedLevels[level.levelId]?.bestTime}
              onClick={() => handleLevelClick(level.levelId)}
            />
          ))}
        </View>
      </View>
    </View>
  )
}
