import * as FileSystem from "expo-file-system/legacy";
import QualityButtons from "./ui/QualityButtons";
import { useCompressedStore } from "@shared/store/useCompressStore";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Image, ScrollView, Slider, Text, View } from "tamagui";
import { Image as ImageCompressor } from "react-native-compressor";
import { Save } from "lucide-react-native";
import { ActiveState, QualityLevels } from "@shared/types/quality-levels.types";
import { saveImage } from "@shared/utils/save-image";

const qualityLevels: Record<QualityLevels, number> = {
  low: 0.9,
  medium: 0.5,
  high: 0.3,
};

const slideLevels: Record<number, QualityLevels> = {
  30: "low",
  50: "medium",
  70: "high",
};
const stateLevels: Record<QualityLevels, number> = {
  low: 30,
  medium: 50,
  high: 70,
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
  const [sliderValue, setSliderValue] = useState({
    sliderStart: 50,
    sliderEnd: 50,
  });

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

  const handleStateAndCompress = async (state: QualityLevels) => {
    if (activeState === state) return;
    setActiveState(state);
    setSliderValue((prev) => ({ ...prev, sliderStart: stateLevels[state] }));
    await imageCompress(originalImg, state);
  };

  useEffect(() => {
    imageCompress(compressImg, "medium");
    setActiveState("medium");
    return () => {
      setActiveState("idle");
      setCompressSizes({ before: "", after: "" });
      setCompressImg("");
    };
  }, []);

  const handleSlideEnd = async (value: number) => {
    const rounded = Math.round(value);
    setSliderValue((prev) => ({
      ...prev,
      sliderEnd: rounded,
    }));
    let invertedQuality = Number((1 - rounded / 100).toFixed(2));

    invertedQuality = Math.min(Math.max(invertedQuality, 0), 1);

    if (slideLevels[rounded]) {
      setActiveState(slideLevels[rounded]);
    } else {
      setActiveState("idle");
    }
    await imageCompress(originalImg, invertedQuality);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={{ uri: compressImg }} style={styles.image} />

        <View style={styles.compress_sizes_container}>
          {compressSizes.after && (
            <>
              <Text color={"$red11"}>Before: {compressSizes.before} MB</Text>
              <Text color={"$blue11"}>After: {compressSizes.after} MB</Text>
            </>
          )}
        </View>

        <View style={styles.quality_container}>
          <QualityButtons
            activeState={activeState}
            handleStateAndCompress={handleStateAndCompress}
          />
        </View>

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

        <Button
          theme={"green"}
          icon={<Save size={20} />}
          onPress={() => saveImage(compressImg)}
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
    height: 20,
    gap: 10,
  },
  quality_container: {
    width: "100%",
    flex: 1,
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
