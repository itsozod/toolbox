import React, { ReactNode } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as Theme,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme();
  return (
    <Theme value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {children}
    </Theme>
  );
};

export default ThemeProvider;
