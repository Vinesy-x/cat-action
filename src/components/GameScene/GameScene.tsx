import { View, Image } from '@tarojs/components'
import { useState, useEffect, useCallback, useRef } from 'react'
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
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [tapFeedback, setTapFeedback] = useState<{ x: number, y: number } | null>(null)
  
  const feedbackTimerRef = useRef<any>(null)

  // 获取容器和图片尺寸
  useEffect(() => {
    const query = Taro.createSelectorQuery()
    query.select('.game-scene').boundingClientRect()
    query.select('.background').boundingClientRect()
    query.exec((res) => {
      if (res[0]) {
        setContainerSize({ width: res[0].width, height: res[0].height })
      }
      if (res[1]) {
        setImageSize({ width: res[1].width, height: res[1].height })
      }
    })
  }, [background])

  // 图片加载完成后获取实际尺寸
  const handleImageLoad = useCallback((e: any) => {
    const { width, height } = e.detail
    console.log('Image loaded:', width, height)
    
    // 重新获取渲染后的尺寸
    setTimeout(() => {
      const query = Taro.createSelectorQuery()
      query.select('.background').boundingClientRect((rect) => {
        if (rect) {
          setImageSize({ width: rect.width, height: rect.height })
          console.log('Image rect:', rect.width, rect.height)
        }
      }).exec()
    }, 100)
  }, [])

  // 处理点击事件
  const handleTap = useCallback((e: any) => {
    if (imageSize.width === 0 || imageSize.height === 0) return
    
    // 获取点击坐标
    const touch = e.touches?.[0] || e.changedTouches?.[0] || e.detail
    const clientX = touch.clientX || touch.x
    const clientY = touch.clientY || touch.y
    
    // 获取场景容器位置
    const query = Taro.createSelectorQuery()
    query.select('.scene-container').boundingClientRect((rect) => {
      if (!rect) return
      
      // 计算相对于图片的百分比位置
      const relX = ((clientX - rect.left) / rect.width) * 100
      const relY = ((clientY - rect.top) / rect.height) * 100
      
      console.log('Tap at:', relX.toFixed(1), relY.toFixed(1))
      
      // 显示点击反馈
      setTapFeedback({ x: relX, y: relY })
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current)
      }
      feedbackTimerRef.current = setTimeout(() => {
        setTapFeedback(null)
      }, 400)

      // 检查是否点中了某只猫
      let found = false
      for (const cat of cats) {
        if (foundCats.includes(cat.id)) continue
        
        const distance = Math.sqrt(
          Math.pow(relX - cat.x, 2) + Math.pow(relY - cat.y, 2)
        )
        
        // radius 是百分比
        if (distance < cat.radius) {
          onCatFound(cat.id)
          found = true
          break
        }
      }
      
      if (!found) {
        // 没找到，给个轻微震动提示
        Taro.vibrateShort({ type: 'light' }).catch(() => {})
      }
    }).exec()
  }, [cats, foundCats, onCatFound, imageSize])

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
        setTimeout(() => setHintCat(null), 2500)
      }
    }
  }, [onHintRequest])

  // 计算提示圈大小（根据 radius 百分比）
  const getHintSize = (radius: number) => {
    // 转换百分比到实际像素尺寸
    const size = (radius * 2 * imageSize.width) / 100
    return Math.max(80, size) // 最小 80rpx
  }

  return (
    <View className='game-scene'>
      <movable-area className='movable-area'>
        <movable-view
          className='movable-view'
          direction='all'
          scale
          scale-min={1}
          scale-max={3}
          scale-value={scale}
          onScale={handleScale}
          onChange={(e: any) => setPosition({ x: e.detail.x, y: e.detail.y })}
        >
          <View className='scene-container' onClick={handleTap}>
            <Image 
              className='background' 
              src={background} 
              mode='aspectFit'
              onLoad={handleImageLoad}
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

            {/* 点击反馈 */}
            {tapFeedback && (
              <View 
                className='tap-feedback'
                style={{
                  left: `${tapFeedback.x}%`,
                  top: `${tapFeedback.y}%`,
                }}
              />
            )}

            {/* 提示圈 */}
            {hintCat && (
              <View 
                className='hint-circle'
                style={{
                  left: `${hintCat.x}%`,
                  top: `${hintCat.y}%`,
                  width: `${getHintSize(hintCat.radius)}rpx`,
                  height: `${getHintSize(hintCat.radius)}rpx`,
                }}
              />
            )}
          </View>
        </movable-view>
      </movable-area>
    </View>
  )
}
