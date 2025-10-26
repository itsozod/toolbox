import React, { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import NotifierProvider from "./NotifierProvider";
import TamaguiProvider from "./TamaguiProvider";
import ThemeProvider from "./ThemeProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <SafeAreaProvider>
      <NotifierProvider>
        <TamaguiProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </TamaguiProvider>
      </NotifierProvider>
    </SafeAreaProvider>
  );
};

export default Providers;
