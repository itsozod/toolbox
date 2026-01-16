import React from "react";
import { ImageFormat } from "@shared/types/image-format.types";
import { FileImage } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { Button, Spinner, View } from "tamagui";

const ConvertButtons = ({
  activeFormat,
  isLoading,
  handleFormatChange,
}: {
  activeFormat: ImageFormat | null;
  isLoading: boolean;
  handleFormatChange: (format: ImageFormat) => void;
}) => {
  return (
    <View style={styles.format_container}>
      <Button
        flex={1}
        borderTopEndRadius={"$0"}
        borderBottomEndRadius={"$0"}
        borderColor={"$color02"}
        theme={activeFormat === "PNG" ? "green" : "dark"}
        onPress={() => handleFormatChange("PNG")}
        disabled={isLoading}
        icon={
          isLoading && activeFormat === "PNG" ? (
            <Spinner />
          ) : (
            <FileImage size={18} />
          )
        }
      >
        PNG
      </Button>
      <Button
        flex={1}
        borderColor={"$color02"}
        borderTopLeftRadius={"$0"}
        borderBottomLeftRadius={"$0"}
        borderTopEndRadius={"$0"}
        borderBottomEndRadius={"$0"}
        theme={activeFormat === "JPEG" ? "green" : "dark"}
        onPress={() => handleFormatChange("JPEG")}
        disabled={isLoading}
        icon={
          isLoading && activeFormat === "JPEG" ? (
            <Spinner />
          ) : (
            <FileImage size={18} />
          )
        }
      >
        JPEG
      </Button>
      <Button
        borderColor={"$color02"}
        flex={1}
        borderTopLeftRadius={"$0"}
        borderBottomLeftRadius={"$0"}
        theme={activeFormat === "WEBP" ? "green" : "dark"}
        onPress={() => handleFormatChange("WEBP")}
        disabled={isLoading}
        icon={
          isLoading && activeFormat === "WEBP" ? (
            <Spinner />
          ) : (
            <FileImage size={18} />
          )
        }
      >
        WEBP
      </Button>
    </View>
  );
};

export default ConvertButtons;

const styles = StyleSheet.create({
  format_container: {
    width: "100%",
    flexDirection: "row",
  },
});
