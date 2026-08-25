import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LanguageSelector } from "@/components/common/LanguageSelector";
import { AppText, SoftButton } from "@/components/ui";
import { useApp } from "@/shared/state/AppProvider";

type AuthMode = "forgot" | "login" | "register";

export function AuthScreen({ initialMode }: { initialMode: AuthMode }) {
  const router = useRouter();
  const { copy, login } = useApp();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [resetNotice, setResetNotice] = useState("");

  const isRegister = mode === "register";
  const isForgot = mode === "forgot";

  const submit = () => {
    setError("");
    setResetNotice("");

    if (
      !email.trim() ||
      (!isForgot && !password) ||
      (isRegister && (!name.trim() || !confirmPassword))
    ) {
      setError(copy.auth.required);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError(copy.auth.invalidEmail);
      return;
    }

    if (isForgot) {
      setResetNotice(copy.auth.resetDemoNotice);
      return;
    }

    if (password.length < 6) {
      setError(copy.auth.passwordShort);
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError(copy.auth.passwordMismatch);
      return;
    }

    login(email, isRegister ? name : undefined);
    router.replace("/home");
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.peachBlob} />
      <View style={styles.blueBlob} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copy.common.back}
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <AppText style={styles.backText}>‹</AppText>
          </Pressable>
          <LanguageSelector compact />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandBlock}>
            <AppText style={styles.brand}>{copy.common.brand}</AppText>
            <AppText style={styles.tagline}>{copy.common.tagline}</AppText>
          </View>

          <View style={styles.card}>
            <AppText style={styles.title}>
              {isForgot
                ? copy.auth.resetTitle
                : isRegister
                  ? copy.auth.registerTitle
                  : copy.auth.loginTitle}
            </AppText>
            <AppText style={styles.subtitle}>
              {isForgot
                ? copy.auth.resetSubtitle
                : isRegister
                  ? copy.auth.registerSubtitle
                  : copy.auth.loginSubtitle}
            </AppText>

            <View style={styles.form}>
              {isRegister ? (
                <TextInput
                  accessibilityLabel={copy.auth.name}
                  autoCapitalize="words"
                  placeholder={copy.auth.name}
                  placeholderTextColor="#B39C91"
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
              ) : null}
              <TextInput
                accessibilityLabel={copy.auth.email}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                placeholder={copy.auth.email}
                placeholderTextColor="#B39C91"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
              {!isForgot ? (
                <TextInput
                  accessibilityLabel={copy.auth.password}
                  autoCapitalize="none"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  placeholder={copy.auth.password}
                  placeholderTextColor="#B39C91"
                  secureTextEntry
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
              ) : null}
              {isRegister ? (
                <TextInput
                  accessibilityLabel={copy.auth.confirmPassword}
                  autoCapitalize="none"
                  placeholder={copy.auth.confirmPassword}
                  placeholderTextColor="#B39C91"
                  secureTextEntry
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              ) : null}

              {error ? <AppText style={styles.error}>{error}</AppText> : null}
              {resetNotice ? (
                <View style={styles.resetNotice}>
                  <AppText style={styles.resetNoticeText}>{resetNotice}</AppText>
                </View>
              ) : null}

              <SoftButton
                title={
                  isForgot
                    ? copy.auth.sendReset
                    : isRegister
                      ? copy.auth.register
                      : copy.auth.login
                }
                onPress={submit}
              />

              {!isRegister && !isForgot ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={copy.auth.forgot}
                  hitSlop={10}
                  onPress={() => {
                    setError("");
                    setResetNotice("");
                    setMode("forgot");
                  }}
                >
                  <AppText style={styles.forgot}>{copy.auth.forgot}</AppText>
                </Pressable>
              ) : null}
            </View>

            <Pressable
              accessibilityRole="button"
              style={styles.switchButton}
              onPress={() => {
                setError("");
                setResetNotice("");
                setMode(isForgot ? "login" : isRegister ? "login" : "register");
              }}
            >
              <AppText style={styles.switchText}>
                {isForgot
                  ? copy.auth.backToLogin
                  : isRegister
                    ? copy.auth.hasAccount
                    : copy.auth.noAccount}
              </AppText>
            </Pressable>

            <View style={styles.localNotice}>
              <AppText style={styles.localNoticeText}>
                🔒 {copy.auth.localNotice}
              </AppText>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#FFF8EF",
  },
  safeArea: {
    flex: 1,
  },
  peachBlob: {
    position: "absolute",
    top: -120,
    left: -135,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: "#FAD7C3",
    opacity: 0.48,
  },
  blueBlob: {
    position: "absolute",
    right: -170,
    bottom: -140,
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: "#D8EEF4",
    opacity: 0.55,
  },
  topBar: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFFA8",
  },
  backText: {
    marginTop: -4,
    fontSize: 36,
    lineHeight: 38,
    color: "#8D6758",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingBottom: 30,
  },
  brandBlock: {
    marginTop: 10,
    marginBottom: 16,
    alignItems: "center",
  },
  brand: {
    fontFamily: "serif",
    fontSize: 40,
    fontWeight: "700",
    color: "#6F5548",
  },
  tagline: {
    marginTop: -4,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    color: "#B28B7E",
  },
  card: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    padding: 24,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.78)",
    borderWidth: 1,
    borderColor: "rgba(190,143,130,0.18)",
    shadowColor: "#7A5C4D",
    shadowOpacity: 0.12,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  title: {
    textAlign: "center",
    fontFamily: "serif",
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "700",
    color: "#6F5548",
  },
  subtitle: {
    marginTop: 7,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    color: "#9A7E70",
  },
  form: {
    marginTop: 22,
    gap: 12,
  },
  input: {
    minHeight: 54,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E9D8CF",
    backgroundColor: "#FFFDFC",
    fontSize: 16,
    color: "#6F5548",
  },
  error: {
    paddingHorizontal: 4,
    fontSize: 13,
    lineHeight: 19,
    color: "#B85555",
  },
  forgot: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    color: "#9A7467",
    textDecorationLine: "underline",
  },
  resetNotice: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#F1EDE5",
  },
  resetNoticeText: {
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: "#8A776E",
  },
  switchButton: {
    marginTop: 18,
    paddingVertical: 8,
  },
  switchText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "#8B6254",
  },
  localNotice: {
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#F1EDE5",
  },
  localNoticeText: {
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: "#8A776E",
  },
});
