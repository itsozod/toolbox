import { StyleSheet } from "react-native";
import { Button, ScrollView, Text, View } from "tamagui";
import { Lightbulb } from "lucide-react-native";

import PhotoTools from "./ui/PhotoTools";

export default function HomeScreen() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: 18 }}>Explore Inspiration</Text>
          <Button style={{ padding: 50 }} icon={<Lightbulb size={30} />} />
        </View>
        <PhotoTools />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    gap: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
