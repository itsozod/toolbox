import { useCompressedStore } from "@shared/store/useCompressStore";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Image, ScrollView, Text, View } from "tamagui";
import { Image as ImageCompressor } from "react-native-compressor";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { Save } from "lucide-react-native";
import { Notifier, NotifierComponents } from "react-native-notifier";
import QualityButtons from "./ui/QualityButtons";
import { ActiveState, QualityLevels } from "@shared/types/qualityLevels";

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

  const [activeState, setActiveState] = useState<ActiveState>("idle");

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

  useEffect(() => {
    return () => {
      setActiveState("idle");
      setCompressSizes({ before: "", after: "" });
      setCompressImg("");
    };
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={{ uri: compressImg }} style={styles.image} />
        {compressSizes.after && (
          <View style={styles.compress_sizes_container}>
            <Text color={"$red11"}>Before: {compressSizes.before} MB</Text>
            <Text color={"$blue11"}>After: {compressSizes.after} MB</Text>
          </View>
        )}
        <View style={styles.quality_container}>
          <QualityButtons
            activeState={activeState}
            handleStateAndCompress={handleStateAndCompress}
          />
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
  compress_sizes_container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
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
