// ============================================================
// Habit Detail Screen — view & interact with one creature
// ============================================================
// Shows:
//  - The creature, large and centered
//  - Creature name, personality, mood, evolution stage
//  - "Complete" button (do habits) / "Check in" (avoid habits)
//  - Streak info and last 7 days as dots
//  - A gentle message based on current mood
// ============================================================

import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts, Spacing, Radius, MoodColors } from "../../src/constants/theme";
import { PERSONALITY_DESCRIPTIONS } from "../../src/constants/creatures";
import { useAppStore } from "../../src/store/useAppStore";
import CreatureAvatar from "../../src/components/CreatureAvatar";
import { todayDate, daysBetween } from "../../src/utils/helpers";

/** Messages based on creature mood */
const MOOD_MESSAGES: Record<string, string> = {
  ecstatic: "is absolutely thriving! Look at that glow! ✨",
  happy: "is feeling good today! Keep it up! 💚",
  neutral: "is doing okay. A little rest is fine. 🌤️",
  sad: "misses you a bit. One small step will help! 🌧️",
  very_sad: "is waiting for you to come back. It's never too late. 💛",
};

export default function HabitDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const habit = useAppStore((s) => s.habits.find((h) => h.id === id));
  const creature = useAppStore((s) => s.getCreatureForHabit(id ?? ""));
  const streak = useAppStore((s) => s.getStreak(id ?? ""));
  const zone = useAppStore((s) => s.getZone(id ?? ""));
  const completeHabit = useAppStore((s) => s.completeHabit);
  const isCompletedToday = useAppStore((s) => s.isCompletedToday(id ?? ""));
  const dailyLogs = useAppStore((s) => s.dailyLogs);
  const deleteHabit = useAppStore((s) => s.deleteHabit);

  if (!habit || !creature || !streak) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.errorText}>Creature not found 😢</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>← Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Build last 7 days dots
  const today = todayDate();
  const last7Days: { date: string; completed: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const log = dailyLogs.find(
      (l) => l.habitId === habit.id && l.date === dateStr
    );
    last7Days.push({ date: dateStr, completed: !!log?.completed });
  }

  const handleComplete = () => {
    if (isCompletedToday) return;
    completeHabit(habit.id);
  };

  const handleAvoidCheckIn = () => {
    if (isCompletedToday) return;
    // For avoid habits, show a gentle check-in
    Alert.alert(
      `How did today go?`,
      `Did you stay on track with "${habit.name}"?`,
      [
        {
          text: "Stayed on track 🌿",
          onPress: () => completeHabit(habit.id),
        },
        {
          text: "Slipped up, trying again tomorrow 💛",
          style: "cancel",
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      "Let this creature go?",
      `${creature.name} will leave your world. You can always create a new habit later.`,
      [
        { text: "Keep them", style: "cancel" },
        {
          text: "Let go",
          style: "destructive",
          onPress: () => {
            deleteHabit(habit.id);
            router.back();
          },
        },
      ]
    );
  };

  const moodMessage = MOOD_MESSAGES[creature.mood] ?? "";

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Back button */}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← World</Text>
        </Pressable>

        {/* Creature display */}
        <View style={styles.creatureSection}>
          <CreatureAvatar creature={creature} size="large" />
          <Text style={styles.creatureName}>{creature.name}</Text>
          <Text style={styles.personality}>
            {creature.personality} · {creature.evolutionStage}
          </Text>
          <Text style={styles.moodMessage}>
            {creature.name} {moodMessage}
          </Text>
        </View>

        {/* Streak */}
        <View style={styles.streakRow}>
          <Text style={styles.streakLabel}>🔥 Streak</Text>
          <Text style={styles.streakValue}>
            {streak.current} day{streak.current !== 1 ? "s" : ""}
          </Text>
          <Text style={styles.streakBest}>
            Best: {streak.longest} day{streak.longest !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Last 7 days */}
        <View style={styles.dotsRow}>
          {last7Days.map((day, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: day.completed
                    ? Colors.secondary
                    : Colors.border,
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.dotsLabel}>last 7 days</Text>

        {/* Action button */}
        {habit.type === "do" ? (
          <Pressable
            style={[
              styles.completeButton,
              isCompletedToday && styles.completedButton,
            ]}
            onPress={handleComplete}
            disabled={isCompletedToday}
          >
            <Text style={styles.completeText}>
              {isCompletedToday ? "Done today ✓" : "Mark complete ✓"}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={[
              styles.completeButton,
              isCompletedToday && styles.completedButton,
              { backgroundColor: isCompletedToday ? Colors.secondary : Colors.accent },
            ]}
            onPress={handleAvoidCheckIn}
            disabled={isCompletedToday}
          >
            <Text style={[styles.completeText, { color: Colors.text }]}>
              {isCompletedToday ? "Checked in today 🌿" : "End-of-day check-in"}
            </Text>
          </Pressable>
        )}

        {/* Delete habit */}
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Remove this habit</Text>
        </Pressable>
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
  creatureSection: {
    alignItems: "center",
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  creatureName: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: "700",
    color: Colors.text,
    marginTop: Spacing.md,
  },
  personality: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textLight,
    marginTop: Spacing.xs,
    textTransform: "capitalize",
  },
  moodMessage: {
    fontSize: Fonts.sizes.md,
    color: Colors.text,
    textAlign: "center",
    marginTop: Spacing.md,
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  streakLabel: {
    fontSize: Fonts.sizes.md,
    color: Colors.text,
    fontWeight: "600",
  },
  streakValue: {
    fontSize: Fonts.sizes.xl,
    fontWeight: "700",
    color: Colors.primary,
  },
  streakBest: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textLight,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotsLabel: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textLight,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  completeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.xl,
    alignItems: "center",
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: Spacing.md,
  },
  completedButton: {
    backgroundColor: Colors.secondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  completeText: {
    color: Colors.white,
    fontSize: Fonts.sizes.lg,
    fontWeight: "700",
  },
  deleteButton: {
    alignItems: "center",
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
  },
  deleteText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textLight,
  },
  errorText: {
    fontSize: Fonts.sizes.lg,
    color: Colors.text,
    textAlign: "center",
    marginTop: 100,
  },
  backLink: {
    fontSize: Fonts.sizes.md,
    color: Colors.primary,
    textAlign: "center",
    marginTop: Spacing.md,
  },
});
