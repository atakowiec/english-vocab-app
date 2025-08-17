import { ImageStyle, StyleSheet } from "react-native";
import logo from "../assets/images/logo.png";
import { Image } from "expo-image";

export default function Logo({ styles, width }: { styles?: ImageStyle, width?: number }) {
  const inlineStyles = width ? {
    width: width,
    height: width * 55 / 220
  } : {};

  return <Image source={logo} style={[logoStyles.logo, inlineStyles, styles]}/>
}

const logoStyles = StyleSheet.create({
  logo: {
    width: 220,
    height: 60,
    contentFit: "contain",
  }
})