import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useThemeColors } from "@/hooks/useThemeColor";

type Props = {
  size?: number
  strokeWidth?: number
  progress: number // 0–100
  color?: string
  backgroundColor?: string
};

export default function CircleProgress({
                                         size = 80,
                                         strokeWidth = 8,
                                         progress,
                                         color = undefined,
                                         backgroundColor = "#fff"
                                       }: Props) {
  const colors = useThemeColors();
  color = color ?? colors.accent_blue;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          stroke={backgroundColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
}
