import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { SplashScreen } from "@/features/splash/SplashScreen";
import { WelcomeScreen } from "@/features/welcome/WelcomeScreen";
import { useApp } from "@/shared/state/AppProvider";

export default function IndexScreen() {
  const [hasSplashFinished, setHasSplashFinished] = useState(false);
  const { isReady, user } = useApp();
  const router = useRouter();

  const handleSplashFinish = useCallback(() => {
    setHasSplashFinished(true);
  }, []);

  useEffect(() => {
    if (isReady && hasSplashFinished && user) {
      router.replace("/home");
    }
  }, [hasSplashFinished, isReady, router, user]);

  if (!hasSplashFinished || user) {
    return <SplashScreen isAppReady={isReady} onFinish={handleSplashFinish} />;
  }

  return <WelcomeScreen />;
}
