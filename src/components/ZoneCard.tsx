// ============================================================
// ZoneCard — a creature's zone/home in the world view
// ============================================================
// Each habit gets a visual zone. The card shows:
//  - The creature avatar
//  - The habit name
//  - A visual health indicator (colours change with zone state)
//  - The zone style hint (pond, library, garden, etc.)
// ============================================================

import { View, Text, StyleSheet, Pressable } from "react-native";
import { Creature, Habit, WorldZone } from "../types";
import { Colors, Fonts, Spacing, Radius } from "../constants/theme";
import CreatureAvatar from "./CreatureAvatar";

/** Zone style → emoji + colour mapping */
const ZONE_VISUALS: Record<string, { emoji: string; color: string }> = {
  pond: { emoji: "🌊", color: "#D0E8FF" },
  library: { emoji: "📚", color: "#F5E6D0" },
  garden: { emoji: "🌸", color: "#E8F5D0" },
  dreamNook: { emoji: "🌙", color: "#E0D0F5" },
  trail: { emoji: "🥾", color: "#D8E8D0" },
  cottage: { emoji: "🏡", color: "#F5E8D8" },
  study: { emoji: "📖", color: "#E0E8F0" },
  zenGarden: { emoji: "🧘", color: "#E8F0E0" },
  clearSky: { emoji: "☀️", color: "#E0F0FF" },
  meadow: { emoji: "🌾", color: "#E8F0D0" },
};

/** Zone health → opacity/saturation effect */
const HEALTH_OPACITY: Record<string, number> = {
  thriving: 1.0,
  normal: 0.85,
  wilting: 0.6,
  neglected: 0.4,
};

interface Props {
  habit: Habit;
  creature: Creature;
  zone: WorldZone;
  onPress: () => void;
}

export default function ZoneCard({ habit, creature, zone, onPress }: Props) {
  const zoneVisual = ZONE_VISUALS[habit.zoneStyle] ?? ZONE_VISUALS.meadow;
  const opacity = HEALTH_OPACITY[zone.visualState] ?? 0.85;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: zoneVisual.color, opacity },
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.zoneEmojiBg}>
        <Text style={styles.zoneEmoji}>{zoneVisual.emoji}</Text>
      </View>

      <CreatureAvatar creature={creature} size="small" />

      <Text style={styles.creatureName}>{creature.name}</Text>
      <Text style={styles.habitName}>{habit.name}</Text>

      {zone.visualState === "thriving" && (
        <Text style={styles.thrivingBadge}>✨</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    aspectRatio: 0.9,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    position: "relative",
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
  },
  zoneEmojiBg: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    opacity: 0.4,
  },
  zoneEmoji: {
    fontSize: 24,
  },
  creatureName: {
    fontSize: Fonts.sizes.sm,
    fontWeight: "700",
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  habitName: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textLight,
    marginTop: 2,
  },
  thrivingBadge: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
    fontSize: 16,
  },
});
