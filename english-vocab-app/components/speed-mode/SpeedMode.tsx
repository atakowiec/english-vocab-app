import { useEffect, useState } from "react";
import { useSpeedModeData } from "@/context/SpeedModeContext";
import { ThemedView } from "@/components/ThemedView";
import RectProgressBar from "@/components/RectProgressBar";
import { Dimensions } from "react-native";
import MainQuestionScreen from "@/components/speed-mode/MainQuestionScreen";
import CountdownScreen from "@/components/speed-mode/CountdownScreen";
import DummyQuestionScreen from "@/components/speed-mode/DummyQuestionScreen";
import { styles } from "@/styles/speed-test"

const { height, width } = Dimensions.get("window");

export default function SpeedMode() {
  const [countdown, setCountdown] = useState(5);
  const { setProgressData, progressData, started, setStage, progressCallback, answerTime } = useSpeedModeData()

  useEffect(() => {
    if (countdown === 0) {
      setProgressData({
        target: 1,
        duration: 1000
      })
    }

    if (countdown === -1) {
      setStage("answering")
      setProgressData({ target: 0, duration: answerTime * 1000 })
      return;
    }

    const timeout = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [countdown]);

  function skipCountdown() {
    setCountdown(0)
    setProgressData({ target: 0, duration: 0 })
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <RectProgressBar targetProgress={progressData.target}
                       width={width - 20}
                       height={height - 50}
                       style={styles.borderProgress}
                       callback={progressCallback}
                       duration={progressData.duration}/>
      {started && <MainQuestionScreen/>}
      {started && <DummyQuestionScreen/>}
      {!started && <CountdownScreen count={countdown} skipCountdown={skipCountdown}/>}
    </ThemedView>
  );
}