// ============================================================
// Root Layout — wraps the entire app
// ============================================================
// This file sets up the navigation container, the status bar,
// and any providers that need to wrap every screen.
// ============================================================

import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Colors } from "../src/constants/theme";
import { useAppStore } from "../src/store/useAppStore";

export default function RootLayout() {
  // Refresh creature moods and zone health every time the app opens
  const refreshWorld = useAppStore((s) => s.refreshWorld);

  useEffect(() => {
    refreshWorld();
  }, [refreshWorld]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: "slide_from_right",
        }}
      />
    </View>
  );
}
