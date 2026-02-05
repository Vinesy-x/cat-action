import { View, Text } from '@tarojs/components'
import { useEffect, useState, useCallback } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { getLevelById } from '../../data/levels'
import { completeLevel } from '../../utils/storage'
import { LevelData, CatPosition } from '../../types'
import GameScene from '../../components/GameScene/GameScene'
import GameHUD from '../../components/GameHUD/GameHUD'
import './index.scss'

export default function Game() {
  const router = useRouter()
  const levelId = parseInt(router.params.levelId || '1')
  
  const [level, setLevel] = useState<LevelData | null>(null)
  const [foundCats, setFoundCats] = useState<string[]>([])
  const [hintsRemaining, setHintsRemaining] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const levelData = getLevelById(levelId)
    if (levelData) {
      setLevel(levelData)
      setHintsRemaining(levelData.hints)
      setStartTime(Date.now())
    } else {
      Taro.showToast({ title: '关卡不存在', icon: 'error' })
      Taro.navigateBack()
    }
  }, [levelId])

  // 找到猫咪
  const handleCatFound = useCallback((catId: string) => {
    if (foundCats.includes(catId)) return
    
    setFoundCats(prev => {
      const newFound = [...prev, catId]
      
      // 播放找到的音效/震动
      Taro.vibrateShort({ type: 'light' })
      
      // 检查是否全部找到
      if (level && newFound.length === level.cats.length) {
        const endTime = Date.now()
        const duration = endTime - startTime
        
        setIsCompleted(true)
        completeLevel(levelId, duration, newFound.length)
        
        // 显示完成弹窗
        setTimeout(() => {
          Taro.showModal({
            title: '🎉 恭喜通关！',
            content: `用时: ${Math.floor(duration / 1000)}秒\n找到了所有 ${newFound.length} 只猫咪！`,
            showCancel: true,
            cancelText: '返回',
            confirmText: '下一关',
            success: (res) => {
              if (res.confirm) {
                // 下一关
                Taro.redirectTo({
                  url: `/pages/game/index?levelId=${levelId + 1}`
                })
              } else {
                Taro.navigateBack()
              }
            }
          })
        }, 500)
      }
      
      return newFound
    })
  }, [foundCats, level, levelId, startTime])

  // 请求提示
  const handleHintRequest = useCallback((): CatPosition | null => {
    if (!level || hintsRemaining <= 0) return null
    
    // 找一只还没找到的猫
    const unfoundCat = level.cats.find(cat => !foundCats.includes(cat.id))
    if (unfoundCat) {
      setHintsRemaining(prev => prev - 1)
      return unfoundCat
    }
    return null
  }, [level, hintsRemaining, foundCats])

  const handleBack = () => {
    Taro.navigateBack()
  }

  if (!level) {
    return (
      <View className='loading'>
        <Text>加载中...</Text>
      </View>
    )
  }

  return (
    <View className='game-page'>
      <GameScene
        background={level.background}
        cats={level.cats}
        onCatFound={handleCatFound}
        foundCats={foundCats}
        onHintRequest={handleHintRequest}
      />
      <GameHUD
        levelName={level.name}
        foundCount={foundCats.length}
        totalCount={level.cats.length}
        hintsRemaining={hintsRemaining}
        onHintClick={() => handleHintRequest()}
        onBackClick={handleBack}
      />
    </View>
  )
}
