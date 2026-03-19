// ============================================================
// Onboarding Step 1 — Welcome Screen
// ============================================================
// "Your tiny world is waiting. Let's bring it to life."
// One button: "Let's go!"
// ============================================================

import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Fonts, Spacing, Radius } from "../../src/constants/theme";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Decorative emoji placeholder — replace with illustration later */}
      <Text style={styles.illustration}>🌱</Text>

      <Text style={styles.title}>Habitarium</Text>
      <Text style={styles.subtitle}>
        Your tiny world is waiting.{"\n"}Let's bring it to life.
      </Text>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => router.push("/onboarding/new-habit")}
      >
        <Text style={styles.buttonText}>Let's go!</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.background,
  },
  illustration: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Fonts.sizes.hero,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Fonts.sizes.lg,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 28,
    marginBottom: Spacing.xxl,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: Radius.xl,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPressed: {
    backgroundColor: Colors.primaryDark,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: Colors.white,
    fontSize: Fonts.sizes.lg,
    fontWeight: "700",
  },
});
