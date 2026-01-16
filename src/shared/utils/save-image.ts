import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { ImageFormat } from "@shared/types/image-format.types";
import { Notifier, NotifierComponents } from "react-native-notifier";

export const saveImage = async (imageUri: string, format?: ImageFormat) => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission not granted");
      return;
    }
    const extension = format?.toLowerCase();
    const newUri = extension
      ? FileSystem.documentDirectory + `myapp_${Date.now()}.${extension}`
      : FileSystem.documentDirectory + `myapp_${Date.now()}.jpg`;

    await FileSystem.copyAsync({
      from: imageUri,
      to: newUri,
    });

    const asset = await MediaLibrary.createAssetAsync(newUri);
    await MediaLibrary.createAlbumAsync("MyApp", asset, false);
    Notifier.showNotification({
      title: "Image saved successfully",
      Component: NotifierComponents.Alert,
      componentProps: {
        alertType: "success",
      },
      containerStyle: {
        top: 50,
      },
    });
  } catch (error) {
    Notifier.showNotification({
      title: "Failed",
      description: "Error saving compressed image" + error,
      Component: NotifierComponents.Alert,
      containerStyle: {
        top: 50,
      },
      componentProps: {
        alertType: "error",
      },
    });
  }
};
