import { useEffect, useState } from "react";

import { SplashScreen } from "@/features/splash/SplashScreen";
import { WelcomeScreen } from "@/features/welcome/WelcomeScreen";

export default function IndexScreen() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return <WelcomeScreen />;
}
