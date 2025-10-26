import { ReactNode } from "react";
import { useColorScheme } from "react-native";
import { TamaguiProvider as Tamagui } from "tamagui";
import { config } from "tamagui.config";

const TamaguiProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme();
  return (
    <Tamagui defaultTheme={colorScheme as string} config={config}>
      {children}
    </Tamagui>
  );
};

export default TamaguiProvider;
