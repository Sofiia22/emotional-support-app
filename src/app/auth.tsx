import { useLocalSearchParams } from "expo-router";

import { AuthScreen } from "@/features/auth/AuthScreen";

export default function AuthRoute() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();

  return <AuthScreen initialMode={mode === "login" ? "login" : "register"} />;
}
