import React, { useEffect } from "react"
import Svg, { Path } from "react-native-svg"
import Animated, { Easing, runOnJS, useAnimatedProps, useSharedValue, withTiming, } from "react-native-reanimated"
import { useThemeColors } from "@/hooks/useThemeColor"
import { StyleProp, ViewStyle } from "react-native"

type RectProgressProps = {
  width?: number
  height?: number
  strokeWidth?: number
  targetProgress: number // 0 - 1
  style?: StyleProp<ViewStyle>
  duration?: number
  running?: boolean
  callback?: () => void
}

const AnimatedPath = Animated.createAnimatedComponent(Path)

export default function RectProgressBar({
                                          width = 200,
                                          height = 200,
                                          targetProgress,
                                          style,
                                          duration = 5000,
                                          running = true,
                                          callback
                                        }: RectProgressProps) {
  const colors = useThemeColors()
  const color = colors.accent_blue
  const backgroundColor = colors.background_blue_3
  const strokeWidth = 15;

  targetProgress = targetProgress * 0.94 // dunno but it looks like .94 is a 100%

  const w = width - strokeWidth
  const h = height - strokeWidth
  const r = 30

  const path = `
    M ${width / 2},${strokeWidth / 2}
    H ${width - r - strokeWidth / 2}
    A ${r},${r} 0 0 1 ${width - strokeWidth / 2},${r + strokeWidth / 2}
    V ${h - r}
    A ${r},${r} 0 0 1 ${width - r - strokeWidth / 2},${h}
    H ${r + strokeWidth / 2}
    A ${r},${r} 0 0 1 ${strokeWidth / 2},${h - r}
    V ${r + strokeWidth / 2}
    A ${r},${r} 0 0 1 ${r + strokeWidth / 2},${strokeWidth / 2}
    Z
  `

  // Perimeter of rounded rect
  const perimeter = 2 * (w + h - 2 * r) + 2 * Math.PI * r

  // Reanimated shared value
  const animatedProgress = useSharedValue(1)

  useEffect(() => {
    if (running) {
      animatedProgress.value = withTiming(
        targetProgress,
        {
          duration,
          easing: Easing.linear,
        },
        (isFinished) => {
          if (isFinished && callback) {
            // ⚡ This runs on the UI thread!
            // If you need to call JS (like setState), wrap it:
            runOnJS(callback)?.();
          }
        }
      )
    } else {
      // stop immediately at current progress
      // noinspection SillyAssignmentJS
      animatedProgress.value = animatedProgress.value;
    }
  }, [targetProgress, duration])

  // Animated strokeDasharray
  const animatedProps = useAnimatedProps(() => {
    const dash = perimeter * animatedProgress.value
    return {
      strokeDasharray: `${dash},${perimeter}`,
    }
  })

  return (
    <Svg width={width} height={height} style={style}>
      {/* Background path */}
      <Path
        d={path}
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Animated progress path */}
      <AnimatedPath
        d={path}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        animatedProps={animatedProps}
      />
    </Svg>
  )
}
