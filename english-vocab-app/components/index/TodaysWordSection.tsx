import SectionBox from "@/components/index/SectionBox";
import { ThemedText } from "@/components/theme/ThemedText";
import { Animated, TouchableOpacity, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useWordOfTheDayLazyQuery, WordOfTheDayQuery } from "@/graphql/gql-generated";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type WordType = WordOfTheDayQuery["wordOfTheDay"]

export default function TodaysWordSection() {
  const [collapsed, setCollapsed] = useState(true);
  const animation = useRef(new Animated.Value(0)).current;
  const [word, setWord] = useState<WordType | null>(null)
  const [fetchWordOfTheDay] = useWordOfTheDayLazyQuery()

  useEffect(() => {
    (async () => {
      try {
        setWord(await getWordOfTheDay())
      } catch (e) {
        console.error("Failed to fetch word of the day:", e)
      }
    })()
  }, []);

  async function getWordOfTheDay(): Promise<WordType> {
    const todayDate = new Date().toISOString().split('T')[0];

    const storedData = await AsyncStorage.getItem('word-of-the-day');
    const storedDate = await AsyncStorage.getItem('word-of-the-day-date');

    if (storedData && storedDate === todayDate) {
      return JSON.parse(storedData);
    }

    const response = await fetchWordOfTheDay({ fetchPolicy: "network-only" });
    let newWord = response.data?.wordOfTheDay;

    if (!newWord) throw new Error("No word of the day found")
    newWord = { ...newWord }

    newWord.type = getWordType(newWord);

    await AsyncStorage.setItem('word-of-the-day', JSON.stringify(newWord));
    await AsyncStorage.setItem('word-of-the-day-date', todayDate);

    return newWord;
  }

  function getWordType(word: WordType): string | null {
    if (!word?.type)
      return null

    const types: Record<string, string> = {
      "adjective": "adj.",
      "adverb": "adv.",
    };

    return types[word.type] || word.type;
  }

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
              {word?.word_en ?? "..."} {word?.type ? `(${word?.type})` : null}
            </ThemedText>
            <ThemedText type={"small"} colorKey={"text_secondary"}>
              -
            </ThemedText>
            <ThemedText type={"small"} colorKey={"text_secondary"}>
              {word?.word_pl ?? "..."}
            </ThemedText>
          </View>
          <Animated.View style={{ maxHeight, overflowX: "hidden" }}>
            <ThemedText type={"defaultSemiBold"} style={{ marginTop: 10 }}>
              Definition
            </ThemedText>
            <ThemedText type={"small"} colorKey={"text_secondary"}>
              {word?.definition_en ?? "..."}
            </ThemedText>
            {word?.examples && word?.examples.length > 0 && (
              <>
                <ThemedText type={"defaultSemiBold"} style={{ marginTop: 10 }}>
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