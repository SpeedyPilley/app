// ============================================================
// Onboarding Step 3 — Egg Selection
// ============================================================
// "Every habit gets its own creature. Pick an egg!"
// Three eggs, each with a colour and personality hint.
// Tapping one → hatch animation → creature revealed.
// ============================================================

import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors, Fonts, Spacing, Radius } from "../../src/constants/theme";
import { EGG_SETS } from "../../src/constants/creatures";
import { PERSONALITY_DESCRIPTIONS } from "../../src/constants/creatures";
import { useAppStore } from "../../src/store/useAppStore";
import { EggOption, HabitType } from "../../src/types";
import { pickRandom } from "../../src/utils/helpers";

/** Egg colours for visual variety */
const EGG_COLORS: Record<string, { bg: string; accent: string; emoji: string }> = {
  warm: { bg: "#FFE0D0", accent: "#FF8A80", emoji: "🥚" },
  cool: { bg: "#D0E8FF", accent: "#80B0FF", emoji: "🥚" },
  earthy: { bg: "#D8F0D0", accent: "#80C080", emoji: "🥚" },
};

export default function EggSelectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ habitName: string; habitType: string }>();
  const createHabit = useAppStore((s) => s.createHabit);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const habits = useAppStore((s) => s.habits);

  const [selectedEgg, setSelectedEgg] = useState<EggOption | null>(null);
  const [hatched, setHatched] = useState(false);
  const [creatureInfo, setCreatureInfo] = useState<{
    name: string;
    personality: string;
    description: string;
  } | null>(null);

  // Pick a random set of 3 eggs
  const [eggSet] = useState(() => pickRandom(EGG_SETS));

  const handleSelectEgg = (egg: EggOption) => {
    setSelectedEgg(egg);
  };

  const handleHatch = () => {
    if (!selectedEgg || !params.habitName) return;

    const habitId = createHabit(
      params.habitName,
      (params.habitType as HabitType) ?? "do",
      selectedEgg
    );

    // Get the creature that was just created
    const store = useAppStore.getState();
    const habit = store.habits.find((h) => h.id === habitId);
    const creature = habit
      ? store.creatures.find((c) => c.id === habit.creatureId)
      : undefined;

    if (creature) {
      setCreatureInfo({
        name: creature.name,
        personality: creature.personality,
        description: PERSONALITY_DESCRIPTIONS[creature.personality],
      });
    }

    setHatched(true);
  };

  const handleContinue = () => {
    // If this is during onboarding (first habit), complete onboarding
    if (habits.length <= 1) {
      completeOnboarding();
    }
    router.replace("/world");
  };

  // ---- Hatched State: Show the creature! ----
  if (hatched && creatureInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.hatchEmoji}>🎉</Text>
        <Text style={styles.hatchTitle}>
          Meet {creatureInfo.name}!
        </Text>
        <Text style={styles.hatchPersonality}>
          A {creatureInfo.personality} little friend
        </Text>
        <Text style={styles.hatchDescription}>
          {creatureInfo.description}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>See your world →</Text>
        </Pressable>
      </View>
    );
  }

  // ---- Egg Selection State ----
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🪺</Text>
      <Text style={styles.title}>Pick an egg!</Text>
      <Text style={styles.subtitle}>
        Every habit gets its own creature.{"\n"}Each egg holds a different friend
        inside.
      </Text>

      <View style={styles.eggRow}>
        {eggSet.map((egg, i) => {
          const colors = EGG_COLORS[egg.variant];
          const isSelected = selectedEgg === egg;
          return (
            <Pressable
              key={i}
              style={[
                styles.eggCard,
                { backgroundColor: colors.bg },
                isSelected && { borderColor: colors.accent, borderWidth: 3 },
              ]}
              onPress={() => handleSelectEgg(egg)}
            >
              <Text style={styles.eggEmoji}>{colors.emoji}</Text>
              <Text style={[styles.eggHint, { color: colors.accent }]}>
                {egg.hintWord}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {selectedEgg && (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleHatch}
        >
          <Text style={styles.buttonText}>Hatch! 🐣</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Fonts.sizes.md,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  eggRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  eggCard: {
    width: 100,
    height: 130,
    borderRadius: Radius.lg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eggEmoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  eggHint: {
    fontSize: Fonts.sizes.sm,
    fontWeight: "700",
    fontStyle: "italic",
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
  // Hatched state styles
  hatchEmoji: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },
  hatchTitle: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  hatchPersonality: {
    fontSize: Fonts.sizes.lg,
    color: Colors.primary,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  hatchDescription: {
    fontSize: Fonts.sizes.md,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
});
