import { useLocalSearchParams } from "expo-router";

import { VoiceJournalScreen } from "@/features/voiceJournal/VoiceJournalScreen";
import { WriteJournalScreen } from "@/features/writeJournal/WriteJournalScreen";

export default function JournalRoute() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();

  if (mode === "speak") return <VoiceJournalScreen />;

  return <WriteJournalScreen />;
}
