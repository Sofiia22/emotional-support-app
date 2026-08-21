import { useRouter } from "expo-router";
import { useEffect } from "react";

import { useApp } from "@/shared/state/AppProvider";

export function useRequireUser() {
  const router = useRouter();
  const { isReady, user } = useApp();

  useEffect(() => {
    if (isReady && !user) {
      router.replace("/");
    }
  }, [isReady, router, user]);

  return { isReady, user };
}
