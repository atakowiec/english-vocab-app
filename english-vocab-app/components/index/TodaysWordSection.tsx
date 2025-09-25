import SectionBox from "@/components/index/SectionBox";
import { ThemedText } from "@/components/ThemedText";
import { Animated, TouchableOpacity, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useWordOfTheDayQuery } from "@/graphql/gql-generated";
import { useEffect, useRef, useState } from "react";

export default function TodaysWordSection() {
  const [collapsed, setCollapsed] = useState(true);
  const animation = useRef(new Animated.Value(0)).current;

  const { data } = useWordOfTheDayQuery({
    fetchPolicy: "network-only"
  })
  const word = data?.wordOfTheDay

  const type = function () {
    if (!data?.wordOfTheDay?.type)
      return null

    const types: Record<string, string> = {
      "adjective": "adj.",
      "adverb": "adv.",
    };

    return types[data?.wordOfTheDay.type] || data?.wordOfTheDay.type;
  }()

  useEffect(() => {
    Animated.timing(animation, {
      toValue: collapsed ? 0 : 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [collapsed]);

  const maxHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150],
  });

  return (
    <TouchableOpacity activeOpacity={0.6}
                      onPress={() => setCollapsed(p => !p)}>
      <SectionBox style={{ gap: 20, alignItems: "flex-start" }}>
        <FontAwesome6 name="book" size={34} color="white"/>
        <View>
          <ThemedText type={"default"}>
            Word of the day
          </ThemedText>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <ThemedText type={"small"} colorKey={"accent_blue"}>
              {data?.wordOfTheDay.word_en ?? "..."} {type ? `(${type})` : null}
            </ThemedText>
            <ThemedText type={"small"} colorKey={"text_secondary"}>
              -
            </ThemedText>
            <ThemedText type={"small"} colorKey={"text_secondary"}>
              {data?.wordOfTheDay.word_pl ?? "..."}
            </ThemedText>
          </View>
          <Animated.View style={{ maxHeight, overflow: "hidden" }}>
            <ThemedText type={"defaultSemiBold"} style={{marginTop: 10}}>
              Definition
            </ThemedText>
            <ThemedText type={"small"} colorKey={"text_secondary"}>
              {word?.definition_en ?? "..."}
            </ThemedText>
            {word?.examples && word?.examples.length > 0 && (
              <>
                <ThemedText type={"defaultSemiBold"} style={{marginTop: 10}}>
                  Example{word.examples.length > 1 ? "s" : ""}
                </ThemedText>
                {word.examples.map((example, i) => (
                  <ThemedText type={"small"} colorKey={"text_secondary"} key={`${example}-${i}`}>
                    - {example}
                  </ThemedText>
                ))}
              </>
            )}
          </Animated.View>
        </View>
      </SectionBox>
    </TouchableOpacity>
  )
}