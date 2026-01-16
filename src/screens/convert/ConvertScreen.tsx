import * as FileSystem from "expo-file-system/legacy";
import ConvertButtons from "./ui/ConvertButtons";
import { useCompressedStore } from "@shared/store/useCompressStore";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
  Button,
  Image,
  ScrollView,
  Slider,
  Spinner,
  Text,
  View,
} from "tamagui";
import { Save } from "lucide-react-native";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { Image as ImageCompressor } from "react-native-compressor";
import { saveImage } from "@shared/utils/save-image";
import { QualityLevels } from "@shared/types/quality-levels.types";
import { ImageFormat } from "@shared/types/image-format.types";

const formatMap: Record<ImageFormat, SaveFormat> = {
  PNG: SaveFormat.PNG,
  JPEG: SaveFormat.JPEG,
  WEBP: SaveFormat.WEBP,
};

const qualityLevels: Record<QualityLevels, number> = {
  low: 0.9,
  medium: 0.5,
  high: 0.3,
};

const ConvertScreen = () => {
  const {
    originalImg,
    compressImg,
    compressSizes,
    setCompressImg,
    setCompressSizes,
  } = useCompressedStore();
  const [activeFormat, setActiveFormat] = useState<ImageFormat | null>(null);
  const [sliderValue, setSliderValue] = useState({
    sliderStart: 50,
    sliderEnd: 50,
  });
  const [isLoading, setIsLoading] = useState(false);

  const convertFormat = async (uri: string, format: ImageFormat) => {
    setIsLoading(true);
    try {
      const converted = await manipulateAsync(uri, [], {
        format: formatMap[format],
        compress: 1,
      });

      const compressed = await ImageCompressor.compress(converted.uri, {
        compressionMethod: "auto",
        quality: 80 / 100,
      });

      const originalInfo = await FileSystem.getInfoAsync(uri);
      const convertedInfo = await FileSystem.getInfoAsync(compressed);

      if (originalInfo.exists && !originalInfo.isDirectory) {
        const originalSizeMB = (originalInfo.size / (1024 * 1024)).toFixed(2);
        setCompressSizes({ before: originalSizeMB });
      }

      if (convertedInfo.exists && !convertedInfo.isDirectory) {
        const convertedSizeMB = (convertedInfo.size / (1024 * 1024)).toFixed(2);
        setCompressSizes({ after: convertedSizeMB });
      }

      setCompressImg(originalImg);
    } catch (error) {
      console.log("Conversion error:", error);
      Notifier.showNotification({
        title: "Conversion failed",
        description: "Error converting image",
        Component: NotifierComponents.Alert,
        containerStyle: {
          top: 50,
        },
        componentProps: {
          alertType: "error",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const imageCompress = async (
    uri: string,
    selectedQuality: QualityLevels | number
  ) => {
    try {
      const compressedUri = await ImageCompressor.compress(uri, {
        compressionMethod: "auto",
        quality:
          typeof selectedQuality === "number"
            ? selectedQuality
            : qualityLevels[selectedQuality],
      });

      const compressedInfo = await FileSystem.getInfoAsync(compressedUri);
      if (compressedInfo.exists && !compressedInfo.isDirectory) {
        const compressedSizeMB = (compressedInfo.size / (1024 * 1024)).toFixed(
          2
        );
        setCompressSizes({ after: compressedSizeMB });
        setCompressImg(compressedUri);
      }
    } catch (error) {
      console.log("ERROR");
    }
  };

  const handleFormatChange = async (format: ImageFormat) => {
    if (activeFormat === format) return;
    setActiveFormat(format);
    setSliderValue({ sliderStart: 50, sliderEnd: 50 });
    await convertFormat(originalImg, format);
  };

  const handleSlideEnd = async (value: number) => {
    const rounded = Math.round(value);
    setSliderValue((prev) => ({
      ...prev,
      sliderEnd: rounded,
    }));
    let invertedQuality = Number((1 - rounded / 100).toFixed(2));

    invertedQuality = Math.min(Math.max(invertedQuality, 0), 1);

    await imageCompress(originalImg, invertedQuality);
  };

  useEffect(() => {
    return () => {
      setCompressImg("");
      setCompressSizes({ before: "", after: "" });
      setActiveFormat(null);
    };
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={{ uri: compressImg }} style={styles.image} />

        <View style={styles.file_sizes_container}>
          {isLoading && <Spinner />}
          {compressSizes.after && !isLoading && (
            <>
              <Text color={"$red11"}>Original: {compressSizes.before} MB</Text>
              <Text color={"$blue11"}>Converted: {compressSizes.after} MB</Text>
            </>
          )}
        </View>

        <ConvertButtons
          activeFormat={activeFormat}
          handleFormatChange={handleFormatChange}
          isLoading={isLoading}
        />

        {activeFormat && (
          <View style={styles.slider_container}>
            <Text>{sliderValue.sliderStart}%</Text>
            <Slider
              style={{ width: "100%" }}
              value={[sliderValue.sliderStart]}
              onSlideEnd={(_, value) => handleSlideEnd(value)}
              onValueChange={(value) =>
                setSliderValue((prev) => ({
                  ...prev,
                  sliderStart: value[0],
                }))
              }
              min={1}
              max={100}
              step={1}
            >
              <Slider.Track>
                <Slider.TrackActive />
              </Slider.Track>
              <Slider.Thumb size="$2" index={0} circular />
            </Slider>
          </View>
        )}

        {activeFormat && (
          <Button
            theme={"green"}
            icon={<Save size={20} />}
            onPress={() => saveImage(compressImg, activeFormat)}
          >
            Save as {activeFormat}
          </Button>
        )}
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
  file_sizes_container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    height: 20,
    gap: 10,
  },
  format_container: {
    width: "100%",
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
