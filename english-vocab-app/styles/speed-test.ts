import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  borderProgress: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  box: {
    margin: 40,
    flex: 1,
    borderRadius: 15,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  optionsBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionButton: {
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
  },
  wordBox: {
    flex: 1,
    alignItems: "center",
    marginTop: 150
  },
  answersBox: {
    gap: 10,
    overflow: "hidden",
    minHeight: 240
  },
  answerButton: {
    paddingVertical: 17,
    borderRadius: 15,
    alignItems: "center",
    textAlign: "center",
  },
  explaination: {
    padding: 15,
    boxSizing: "content-box",
    borderRadius: 15,
    height: 120,
    overflow: "hidden",
  },
  newMeaning: {
    paddingHorizontal: 20,
  },
  hideBoxWrapper: {
    position: "relative"
  },
  hideBox: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 500,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderWidth: 1,
    borderColor: "red",
  },
  streakBox: {
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
})