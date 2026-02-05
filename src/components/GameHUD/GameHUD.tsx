import { View, Text } from '@tarojs/components'
import './GameHUD.scss'

interface GameHUDProps {
  levelName: string
  foundCount: number
  totalCount: number
  hintsRemaining: number
  onHintClick: () => void
  onBackClick: () => void
}

export default function GameHUD({
  levelName,
  foundCount,
  totalCount,
  hintsRemaining,
  onHintClick,
  onBackClick
}: GameHUDProps) {
  return (
    <View className='game-hud'>
      {/* 顶部栏 */}
      <View className='top-bar'>
        <View className='back-btn' onClick={onBackClick}>
          ← 返回
        </View>
        <Text className='level-name'>{levelName}</Text>
        <View className='progress'>
          <Text className='progress-text'>🐱 {foundCount}/{totalCount}</Text>
        </View>
      </View>

      {/* 底部工具栏 */}
      <View className='bottom-bar'>
        <View 
          className={`hint-btn ${hintsRemaining === 0 ? 'disabled' : ''}`}
          onClick={hintsRemaining > 0 ? onHintClick : undefined}
        >
          <Text className='hint-icon'>💡</Text>
          <Text className='hint-count'>{hintsRemaining}</Text>
        </View>
      </View>
    </View>
  )
}
