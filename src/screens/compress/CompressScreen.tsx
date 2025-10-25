import { useCompressedStore } from "@shared/store/useCompressStore";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Image, ScrollView, Text, View } from "tamagui";
import { Image as ImageCompressor } from "react-native-compressor";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { Save } from "lucide-react-native";
import { Notifier, NotifierComponents } from "react-native-notifier";

type QualityLevels = "low" | "medium" | "high";

const qualityLevels: Record<QualityLevels, number> = {
  low: 0.9,
  medium: 0.5,
  high: 0.2,
};

const saveCompressedImage = async (compressedUri: string) => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission not granted");
      return;
    }

    const asset = await MediaLibrary.createAssetAsync(compressedUri);
    await MediaLibrary.createAlbumAsync("MyApp", asset, false);
    Notifier.showNotification({
      title: "Image saved successfully",
      Component: NotifierComponents.Alert,
      componentProps: {
        alertType: "success",
      },
    });
  } catch (error) {
    Notifier.showNotification({
      title: "Failed",
      description: "Error saving compressed image" + error,
      Component: NotifierComponents.Alert,
      componentProps: {
        alertType: "error",
      },
    });
  }
};
const CompressScreen = () => {
  const {
    originalImg,
    compressImg,
    compressSizes,
    setCompressImg,
    setCompressSizes,
  } = useCompressedStore();

  const [activeState, setActiveState] = useState<
    "idle" | "low" | "medium" | "high"
  >("idle");

  const imageCompress = async (uri: string, selectedQuality: QualityLevels) => {
    try {
      const compressedUri = await ImageCompressor.compress(uri, {
        compressionMethod: "auto",
        quality: qualityLevels[selectedQuality],
      });

      const compressedInfo = await FileSystem.getInfoAsync(compressedUri);
      const compressedSizeMB = (compressedInfo.size / (1024 * 1024)).toFixed(2);

      setCompressSizes({ after: compressedSizeMB });
      setCompressImg(compressedUri);
    } catch (error) {
      console.log("ERROR");
    }
  };

  const handleStateAndCompress = async (state: QualityLevels) => {
    setActiveState(state);
    await imageCompress(originalImg, state);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={{ uri: compressImg }} style={styles.image} />
        <Text>Before: {compressSizes.before}MB</Text>
        {compressSizes.after && <Text>After: {compressSizes.after}MB</Text>}
        <View style={styles.quality_container}>
          <Button
            flex={1}
            borderTopEndRadius={"$0"}
            borderBottomEndRadius={"$0"}
            borderColor={"$color02"}
            theme={activeState === "low" ? "green" : "dark"}
            onPress={() => handleStateAndCompress("low")}
          >
            Low
          </Button>
          <Button
            flex={1}
            borderColor={"$color02"}
            borderTopLeftRadius={"$0"}
            borderBottomLeftRadius={"$0"}
            borderTopEndRadius={"$0"}
            borderBottomEndRadius={"$0"}
            theme={activeState === "medium" ? "green" : "dark"}
            onPress={() => handleStateAndCompress("medium")}
          >
            Medium
          </Button>
          <Button
            borderColor={"$color02"}
            flex={1}
            borderTopLeftRadius={"$0"}
            borderBottomLeftRadius={"$0"}
            theme={activeState === "high" ? "green" : "dark"}
            onPress={() => handleStateAndCompress("high")}
          >
            High
          </Button>
        </View>

        <Button
          theme={"green"}
          icon={<Save size={20} />}
          onPress={() => saveCompressedImage(compressImg)}
        >
          Save
        </Button>
      </View>
    </ScrollView>
  );
};

export default CompressScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    gap: 20,
  },
  quality_container: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
  },
  image: {
    width: "auto",
    height: 300,
    borderRadius: 12,
  },
});
