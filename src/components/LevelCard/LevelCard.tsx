import { View, Text, Image } from '@tarojs/components'
import { LevelData } from '../../types'
import './LevelCard.scss'

interface LevelCardProps {
  level: LevelData
  isUnlocked: boolean
  isCompleted: boolean
  bestTime?: number
  onClick: () => void
}

const difficultyLabels = {
  easy: '简单',
  normal: '普通',
  hard: '困难'
}

export default function LevelCard({
  level,
  isUnlocked,
  isCompleted,
  bestTime,
  onClick
}: LevelCardProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
  }

  return (
    <View 
      className={`level-card ${!isUnlocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
      onClick={isUnlocked ? onClick : undefined}
    >
      <View className='thumbnail'>
        {isUnlocked ? (
          <>
            <Image src={level.background} mode='aspectFill' className='bg-image' />
            <View className={`difficulty-badge ${level.difficulty}`}>
              {difficultyLabels[level.difficulty]}
            </View>
          </>
        ) : (
          <View className='lock-overlay'>🔒</View>
        )}
        {isCompleted && (
          <View className='completed-badge'>✓</View>
        )}
      </View>
      
      <View className='info'>
        <Text className='name'>{level.name}</Text>
        <Text className='cats-count'>🐱 × {level.cats.length}</Text>
        {bestTime && (
          <Text className='best-time'>⏱ {formatTime(bestTime)}</Text>
        )}
      </View>
    </View>
  )
}
