import { ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NotifierWrapper } from "react-native-notifier";

const NotifierProvider = ({ children }: { children: ReactNode }) => {
  return (
    <GestureHandlerRootView>
      <NotifierWrapper>{children}</NotifierWrapper>
    </GestureHandlerRootView>
  );
};

export default NotifierProvider;
