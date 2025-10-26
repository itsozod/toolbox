import { useCompressedStore } from "@shared/store/useCompressStore";
import { ImageUpscale, RefreshCcwDot } from "lucide-react-native";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { Button, Text, View } from "tamagui";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { router } from "expo-router";

const PhotoTools = () => {
  const colorScheme = useColorScheme();
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const { setCompressImg, setOriginalImg, setCompressSizes } =
    useCompressedStore();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const originalUri = result.assets?.[0]?.uri;
      const originalInfo = await FileSystem.getInfoAsync(originalUri);
      const originalSizeMB = (originalInfo.size / (1024 * 1024)).toFixed(2);
      setCompressSizes({ before: originalSizeMB });
      setCompressImg(originalUri);
      setOriginalImg(originalUri);
      router.push("/compress/compress");
    }
  };

  useEffect(() => {
    if (!status?.granted) {
      requestPermission();
    }
  }, [status]);

  return (
    <View style={{ gap: 15 }}>
      <Text style={{ fontSize: 18 }}>Photo</Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 5,
          justifyContent: "space-between",
        }}
      >
        <Button
          p="$5"
          gap="$1"
          size="$8"
          items="center"
          justify="center"
          flexDirection="column"
          onPress={pickImage}
        >
          <ImageUpscale
            color={colorScheme === "dark" ? "#fff" : "#000"}
            size={28}
          />
          <Text>Compress</Text>
        </Button>
        <Button
          p="$5"
          gap="$1"
          size="$8"
          items="center"
          justify="center"
          flexDirection="column"
        >
          <RefreshCcwDot
            color={colorScheme === "dark" ? "#fff" : "#000"}
            size={28}
          />
          <Text fontSize="$5">Convert</Text>
        </Button>

        <Button
          p="$5"
          gap="$1"
          size="$8"
          items="center"
          justify="center"
          flexDirection="column"
        >
          <RefreshCcwDot
            color={colorScheme === "dark" ? "#fff" : "#000"}
            size={28}
          />
          <Text>Convert</Text>
        </Button>
      </View>
    </View>
  );
};

export default PhotoTools;
