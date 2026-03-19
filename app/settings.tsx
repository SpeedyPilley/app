// ============================================================
// Settings Screen — simple settings for MVP
// ============================================================

import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts, Spacing, Radius } from "../src/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const router = useRouter();

  const handleResetAll = () => {
    Alert.alert(
      "Reset everything?",
      "This will delete all your habits, creatures, and progress. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            // Reload the app by navigating to root
            router.replace("/");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Habitarium v1.0.0{"\n"}
            A cosy habit tracker where your tiny habits grow a tiny world.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <Pressable style={styles.dangerButton} onPress={handleResetAll}>
            <Text style={styles.dangerText}>Reset all data</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  backButton: {
    paddingVertical: Spacing.md,
  },
  backText: {
    fontSize: Fonts.sizes.md,
    color: Colors.primary,
    fontWeight: "600",
  },
  title: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.md,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  aboutText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textLight,
    lineHeight: 20,
  },
  dangerButton: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  dangerText: {
    color: Colors.danger,
    fontSize: Fonts.sizes.md,
    fontWeight: "600",
  },
});
