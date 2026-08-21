import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { SplashScreen } from "@/features/splash/SplashScreen";
import { WelcomeScreen } from "@/features/welcome/WelcomeScreen";
import { useApp } from "@/shared/state/AppProvider";

export default function IndexScreen() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const { isReady, user } = useApp();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady && !isSplashVisible && user) {
      router.replace("/home");
    }
  }, [isReady, isSplashVisible, router, user]);

  if (!isReady || isSplashVisible || user) {
    return <SplashScreen />;
  }

  return <WelcomeScreen />;
}
