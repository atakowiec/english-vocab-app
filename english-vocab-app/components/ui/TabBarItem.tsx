import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useThemeColors } from "@/hooks/theme/useThemeColor";

type Props = {
  name: string;
  focused: boolean;
  onPress: () => void;
  index: number;
}

export default function TabBarItem({ name, focused, onPress, index }: Props) {
  const colors = useThemeColors();
  const color = focused ? colors.background_blue_2 : colors.text_secondary;

  return (
    <>
      {index > 0 && <TabBarSeparator/>}
      <TouchableOpacity onPress={onPress}
                        style={[styles.item, focused && { backgroundColor: colors.accent_blue }]}>
        {{
          "index": <Entypo name="home" size={24} color={color}/>,
          "mode-selector": <FontAwesome name="play" size={24} color={color}/>,
          "profile": <FontAwesome name="user" size={24} color={color}/>,
        }[name]}
      </TouchableOpacity>
    </>
  );
}

function TabBarSeparator() {
  return <View style={[styles.separator, { backgroundColor: "#3f3f3f" }]}/>
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 15
  },
  separator: {
    width: 1,
    height: 25,
  }
})