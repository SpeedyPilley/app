// ============================================================
// Onboarding Step 2 — Create Your First Habit
// ============================================================
// User picks a habit (from suggestions or types their own)
// and chooses whether it's a "do" or "avoid" habit.
// ============================================================

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors, Fonts, Spacing, Radius } from "../../src/constants/theme";
import { SUGGESTED_HABITS } from "../../src/constants/creatures";
import { HabitType } from "../../src/types";

export default function NewHabitScreen() {
  const router = useRouter();
  const [habitName, setHabitName] = useState("");
  const [habitType, setHabitType] = useState<HabitType>("do");

  const canProceed = habitName.trim().length > 0;

  const handleSelectSuggestion = (name: string, type: HabitType) => {
    setHabitName(name);
    setHabitType(type);
  };

  const handleNext = () => {
    if (!canProceed) return;
    // Pass habit info to egg selection via URL params
    router.push({
      pathname: "/onboarding/egg-select",
      params: { habitName: habitName.trim(), habitType },
    });
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.emoji}>✨</Text>
      <Text style={styles.title}>Pick your first tiny habit</Text>
      <Text style={styles.subtitle}>
        Start small. Really small.{"\n"}What's one tiny thing you'd like to do
        (or avoid) each day?
      </Text>

      {/* Suggestions */}
      <View style={styles.suggestions}>
        {SUGGESTED_HABITS.map((s) => (
          <Pressable
            key={s.name}
            style={[
              styles.chip,
              habitName === s.name && styles.chipSelected,
            ]}
            onPress={() => handleSelectSuggestion(s.name, s.type)}
          >
            <Text
              style={[
                styles.chipText,
                habitName === s.name && styles.chipTextSelected,
              ]}
            >
              {s.name}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Custom input */}
      <Text style={styles.orText}>or type your own:</Text>
      <TextInput
        style={styles.input}
        value={habitName}
        onChangeText={(text) => {
          setHabitName(text);
          // Reset type to "do" for custom habits (user can change below)
          setHabitType("do");
        }}
        placeholder="e.g. Meditate for 5 minutes"
        placeholderTextColor={Colors.textLight}
      />

      {/* Habit type picker */}
      <Text style={styles.typeLabel}>Is this something you want to...</Text>
      <View style={styles.typeRow}>
        <Pressable
          style={[styles.typeButton, habitType === "do" && styles.typeButtonActive]}
          onPress={() => setHabitType("do")}
        >
          <Text style={styles.typeEmoji}>✅</Text>
          <Text
            style={[
              styles.typeText,
              habitType === "do" && styles.typeTextActive,
            ]}
          >
            Do each day
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.typeButton,
            habitType === "avoid" && styles.typeButtonActive,
          ]}
          onPress={() => setHabitType("avoid")}
        >
          <Text style={styles.typeEmoji}>🚫</Text>
          <Text
            style={[
              styles.typeText,
              habitType === "avoid" && styles.typeTextActive,
            ]}
          >
            Avoid each day
          </Text>
        </Pressable>
      </View>

      {/* Next button */}
      <Pressable
        style={[styles.button, !canProceed && styles.buttonDisabled]}
        onPress={handleNext}
        disabled={!canProceed}
      >
        <Text style={styles.buttonText}>Choose an egg →</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 80,
    paddingBottom: Spacing.xxl,
    alignItems: "center",
  },
  emoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Fonts.sizes.xl,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Fonts.sizes.md,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  chip: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: Colors.white,
  },
  orText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
  },
  input: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: Fonts.sizes.md,
    color: Colors.text,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  typeLabel: {
    fontSize: Fonts.sizes.md,
    color: Colors.text,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  typeRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  typeButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.border,
  },
  typeButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: "#FFF0EE",
  },
  typeEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  typeText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textLight,
    fontWeight: "600",
  },
  typeTextActive: {
    color: Colors.primary,
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
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.white,
    fontSize: Fonts.sizes.lg,
    fontWeight: "700",
  },
});
