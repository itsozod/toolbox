import { useCompressedStore } from "@shared/store/useCompressStore";
import React from "react";
import { StyleSheet } from "react-native";
import { Button, Image, ScrollView, View } from "tamagui";

const ConvertScreen = () => {
  const { compressImg } = useCompressedStore();
  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={{ uri: compressImg }} style={styles.image} />
        <View style={styles.quality_container}>
          <Button flex={1} borderColor={"$color02"}>
            PNG
          </Button>
          <Button flex={1} borderColor={"$color02"}>
            JPEG
          </Button>
          <Button flex={1} borderColor={"$color02"}>
            WEBP
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default ConvertScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    gap: 20,
  },
  compress_sizes_container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  quality_container: {
    width: "100%",
    gap: 5,
    flexDirection: "row",
  },
  slider_container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 15,
  },
  image: {
    width: "auto",
    height: 300,
    borderRadius: 12,
  },
});
