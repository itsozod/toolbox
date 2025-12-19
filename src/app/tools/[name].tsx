import CompressScreen from "@screens/compress/CompressScreen";
import ConvertScreen from "@screens/convert/ConvertScreen";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "tamagui";

const Tools = () => {
  const { name } = useLocalSearchParams();

  const tools: Record<string, React.ComponentType> = {
    compress: CompressScreen,
    convert: ConvertScreen,
  };

  const SelectedTool = tools[name as string];

  if (!SelectedTool) {
    return (
      <View>
        <Text>Unknown tool: {name}</Text>
      </View>
    );
  }
  return <SelectedTool />;
};

export default Tools;
