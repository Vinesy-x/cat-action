import { View, Image } from '@tarojs/components'
import { useState, useEffect, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { CatPosition } from '../../types'
import './GameScene.scss'

interface GameSceneProps {
  background: string
  cats: CatPosition[]
  onCatFound: (catId: string) => void
  foundCats: string[]
  onHintRequest?: () => CatPosition | null
}

export default function GameScene({ 
  background, 
  cats, 
  onCatFound, 
  foundCats,
  onHintRequest 
}: GameSceneProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [hintCat, setHintCat] = useState<CatPosition | null>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    // 获取容器尺寸
    const query = Taro.createSelectorQuery()
    query.select('.game-scene').boundingClientRect((rect) => {
      if (rect) {
        setContainerSize({ width: rect.width, height: rect.height })
      }
    }).exec()
  }, [])

  // 处理点击事件
  const handleTap = useCallback((e: any) => {
    const { x, y } = e.detail
    
    // 转换为相对于场景的百分比坐标
    const relX = ((x - position.x) / scale / containerSize.width) * 100
    const relY = ((y - position.y) / scale / containerSize.height) * 100

    // 检查是否点中了某只猫
    for (const cat of cats) {
      if (foundCats.includes(cat.id)) continue
      
      const distance = Math.sqrt(
        Math.pow(relX - cat.x, 2) + Math.pow(relY - cat.y, 2)
      )
      
      // 转换 radius 为百分比判定
      const radiusPercent = (cat.radius / containerSize.width) * 100 * 2
      
      if (distance < radiusPercent) {
        onCatFound(cat.id)
        return
      }
    }
  }, [cats, foundCats, onCatFound, position, scale, containerSize])

  // 双指缩放
  const handleScale = useCallback((e: any) => {
    const newScale = Math.max(1, Math.min(3, e.detail.scale))
    setScale(newScale)
  }, [])

  // 显示提示
  const showHint = useCallback(() => {
    if (onHintRequest) {
      const cat = onHintRequest()
      if (cat) {
        setHintCat(cat)
        setTimeout(() => setHintCat(null), 2000)
      }
    }
  }, [onHintRequest])

  return (
    <View className='game-scene'>
      <movable-area className='movable-area'>
        <movable-view
          className='movable-view'
          direction='all'
          scale
          scale-min={1}
          scale-max={3}
          onScale={handleScale}
          onChange={(e: any) => setPosition({ x: e.detail.x, y: e.detail.y })}
          onTap={handleTap}
        >
          <Image 
            className='background' 
            src={background} 
            mode='aspectFill'
          />
          
          {/* 已找到的猫咪标记 */}
          {cats.filter(cat => foundCats.includes(cat.id)).map(cat => (
            <View 
              key={cat.id}
              className='found-marker'
              style={{
                left: `${cat.x}%`,
                top: `${cat.y}%`,
              }}
            >
              🐱
            </View>
          ))}

          {/* 提示圈 */}
          {hintCat && (
            <View 
              className='hint-circle'
              style={{
                left: `${hintCat.x}%`,
                top: `${hintCat.y}%`,
                width: `${hintCat.radius * 4}px`,
                height: `${hintCat.radius * 4}px`,
              }}
            />
          )}
        </movable-view>
      </movable-area>
    </View>
  )
}
