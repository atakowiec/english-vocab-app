import { SpeedModeProvider } from "@/context/SpeedModeContext";
import SpeedMode from "@/components/speed-mode/SpeedMode";


export default function SpeedModeScreen() {
  return (
    <SpeedModeProvider>
      <SpeedMode/>
    </SpeedModeProvider>
  );
}