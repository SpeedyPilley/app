// ============================================================
// CreatureAvatar — displays a creature with mood-based visuals
// ============================================================
// For MVP, we use emoji + styled containers to represent creatures.
// Later, these get replaced with actual 2D sprite art or 3D models.
// The component shows the creature's species, mood, and stage.
// ============================================================

import { View, Text, StyleSheet, Pressable } from "react-native";
import { Creature } from "../types";
import { Colors, Radius, Spacing, MoodColors } from "../constants/theme";

/** Species → emoji mapping (placeholder for real art) */
const SPECIES_EMOJI: Record<string, string> = {
  blobby: "🫧",
  leafling: "🌿",
  fluffkin: "☁️",
  ember: "🔥",
  droplet: "💧",
  dustmote: "✨",
};

/** Mood → expression emoji overlay */
const MOOD_FACE: Record<string, string> = {
  ecstatic: "🤩",
  happy: "😊",
  neutral: "😐",
  sad: "😢",
  very_sad: "😭",
};

/** Stage label */
const STAGE_LABEL: Record<string, string> = {
  egg: "🥚",
  baby: "baby",
  grown: "✦",
};

interface Props {
  creature: Creature;
  size?: "small" | "medium" | "large";
  onPress?: () => void;
}

export default function CreatureAvatar({ creature, size = "medium", onPress }: Props) {
  const sizeValue = size === "small" ? 60 : size === "large" ? 140 : 90;
  const emojiSize = size === "small" ? 28 : size === "large" ? 64 : 40;
  const moodColor = MoodColors[creature.mood] || Colors.surface;

  const content = (
    <View
      style={[
        styles.container,
        {
          width: sizeValue,
          height: sizeValue,
          borderRadius: sizeValue / 2,
          backgroundColor: moodColor,
        },
      ]}
    >
      <Text style={[styles.speciesEmoji, { fontSize: emojiSize }]}>
        {SPECIES_EMOJI[creature.species] ?? "🫧"}
      </Text>
      <View style={styles.moodBadge}>
        <Text style={styles.moodEmoji}>
          {MOOD_FACE[creature.mood] ?? "😊"}
        </Text>
      </View>
      {creature.evolutionStage === "grown" && (
        <View style={styles.stageBadge}>
          <Text style={styles.stageText}>✦</Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  speciesEmoji: {
    textAlign: "center",
  },
  moodBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 12,
  },
  stageBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  stageText: {
    fontSize: 10,
    color: Colors.text,
  },
});
