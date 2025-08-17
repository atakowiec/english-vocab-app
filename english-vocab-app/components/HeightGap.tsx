import { Dimensions, View } from "react-native";

type Props = { heightPercent: number }

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function HeightGap({ heightPercent }: Props) {
  return <View style={{ height: SCREEN_HEIGHT * heightPercent }}/>
}