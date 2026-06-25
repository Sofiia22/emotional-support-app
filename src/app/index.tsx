import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>P</Text>
        </View>

        <Text style={styles.title}>Plekei</Text>
        <Text style={styles.subtitle}>Cherish and breathe</Text>

        <Text style={styles.description}>
          A peaceful space for your heart, your thoughts, and your daily walk.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7EFE7",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    shadowColor: "#7A5C45",
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "700",
    color: "#7A5C45",
  },
  title: {
    fontSize: 42,
    fontWeight: "700",
    color: "#2F241D",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#7A5C45",
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#6F6258",
    maxWidth: 310,
  },
  button: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2F241D",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2F241D",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
