export type ThemeColors = {
  text_primary: string;
  text_secondary: string;
  background_blue_1: string;
  background_blue_2: string;
  background_blue_3: string;
  accent_blue: string;
  green: string;
  red: string;
}

export type Theme = {
  light: ThemeColors;
  dark: ThemeColors;
}

export const Colors: Theme = {
  light: { // todo handle light mode
    text_primary: '#FFFFFF',
    text_secondary: '#99AAC4',
    background_blue_1: "white",
    background_blue_2: "#0D2136",
    background_blue_3: "#162C46",
    accent_blue: "#5B8CFF",
    green: "#17bb00",
    red: "#c90000"
  },
  dark: {
    text_primary: '#FFFFFF',
    text_secondary: '#99AAC4',
    background_blue_1: "#031525",
    background_blue_2: "#0D2136",
    background_blue_3: "#162C46",
    accent_blue: "#5B8CFF",
    green: "#17bb00",
    red: "#c90000"
  },
};
