// ============================================================
// World View — the main home screen
// ============================================================
// This is what the user sees every time they open the app.
// It shows their entire world: all zones, all creatures,
// a streak summary, and a button to add new habits.
// ============================================================

import { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts, Spacing, Radius } from "../src/constants/theme";
import { useAppStore } from "../src/store/useAppStore";
import ZoneCard from "../src/components/ZoneCard";

/** Max habits for free tier */
const MAX_FREE_HABITS = 3;

export default function WorldScreen() {
  const router = useRouter();
  const habits = useAppStore((s) => s.habits);
  const creatures = useAppStore((s) => s.creatures);
  const worldZones = useAppStore((s) => s.worldZones);
  const streaks = useAppStore((s) => s.streaks);
  const refreshWorld = useAppStore((s) => s.refreshWorld);

  // Refresh moods and zones each time this screen appears
  useEffect(() => {
    refreshWorld();
  }, [refreshWorld]);

  // Calculate overall streak summary
  const totalActiveStreaks = streaks.filter((s) => s.current > 0).length;
  const longestCurrent = streaks.reduce(
    (max, s) => Math.max(max, s.current),
    0
  );

  const canAddMore = habits.length < MAX_FREE_HABITS;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Your World</Text>
            <Text style={styles.streakSummary}>
              {totalActiveStreaks > 0
                ? `🔥 ${totalActiveStreaks} active streak${totalActiveStreaks > 1 ? "s" : ""} · Best: ${longestCurrent} day${longestCurrent > 1 ? "s" : ""}`
                : "🌱 Complete a habit to start a streak!"}
            </Text>
          </View>
          <Pressable
            style={styles.settingsButton}
            onPress={() => router.push("/settings")}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </Pressable>
        </View>

        {/* World Grid — zones with creatures */}
        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌍</Text>
            <Text style={styles.emptyText}>
              Your world is empty!{"\n"}Create a habit to hatch your first
              creature.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {habits.map((habit) => {
              const creature = creatures.find(
                (c) => c.id === habit.creatureId
              );
              const zone = worldZones.find((z) => z.habitId === habit.id);
              if (!creature || !zone) return null;

              return (
                <ZoneCard
                  key={habit.id}
                  habit={habit}
                  creature={creature}
                  zone={zone}
                  onPress={() =>
                    router.push({
                      pathname: "/habit/[id]",
                      params: { id: habit.id },
                    })
                  }
                />
              );
            })}
          </View>
        )}

        {/* Add Habit Button */}
        {canAddMore && (
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
            ]}
            onPress={() => router.push("/onboarding/new-habit")}
          >
            <Text style={styles.addButtonText}>+ New Habit</Text>
          </Pressable>
        )}

        {!canAddMore && (
          <View style={styles.limitBanner}>
            <Text style={styles.limitText}>
              You've got {MAX_FREE_HABITS} habits — the free tier max!{"\n"}
              Premium coming soon for more creatures 🌟
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  container: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: "700",
    color: Colors.text,
  },
  streakSummary: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  settingsButton: {
    padding: Spacing.sm,
  },
  settingsIcon: {
    fontSize: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.xxl * 2,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Fonts.sizes.md,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 24,
  },
  addButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.xl,
    alignItems: "center",
    marginTop: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonPressed: {
    transform: [{ scale: 0.97 }],
  },
  addButtonText: {
    color: Colors.text,
    fontSize: Fonts.sizes.lg,
    fontWeight: "700",
  },
  limitBanner: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginTop: Spacing.md,
    alignItems: "center",
  },
  limitText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
});
