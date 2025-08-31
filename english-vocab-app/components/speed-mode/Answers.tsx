import { View } from "react-native";
import Answer from "@/components/speed-mode/Answer";
import Explaination from "@/components/speed-mode/Explaination";
import { useSpeedModeData } from "@/context/SpeedModeContext";
import { styles } from "@/styles/speed-test";
import { useState } from "react";

export default function Answers() {
  const { currentWord } = useSpeedModeData();
  const [layoutData, setLayoutData] = useState<{ height: number, y: number }>({ height: 0, y: 0 });

  return (
    <>
      <View style={{ overflow: "hidden", marginBottom: -150 }}>
        <View style={styles.answersBox}
              onLayout={(e) => {
                const { height, y } = e.nativeEvent.layout;
                setLayoutData({ height, y });
              }}>
          {currentWord!.answers.map((answer, i) => (
            <Answer
              key={`${i}-${answer}`}
              answer={answer}
              parentLayoutData={layoutData}
            />
          ))}
        </View>
        <Explaination word={currentWord}/>
      </View>
    </>
  );
}