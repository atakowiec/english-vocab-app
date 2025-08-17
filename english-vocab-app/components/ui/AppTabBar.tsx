import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
import TabBarItem from "@/components/ui/TabBarItem";
import { useThemeColors } from "@/hooks/useThemeColor";

export default function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.tabBar, { backgroundColor: colors.background_blue_2 }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name)
          }
        };

        return <TabBarItem name={route.name} focused={isFocused} index={index} onPress={onPress} key={route.key}/>
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10,
    padding: 10,
    borderRadius: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    gap: 10,
    zIndex: 100,
    alignItems: "center",
  },
})