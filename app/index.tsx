// ============================================================
// Entry Screen — decides where to send the user
// ============================================================
// If they haven't done onboarding yet → go to onboarding.
// If they have → go straight to the World View (home).
// ============================================================

import { Redirect } from "expo-router";
import { useAppStore } from "../src/store/useAppStore";

export default function EntryScreen() {
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding/welcome" />;
  }

  return <Redirect href="/world" />;
}
