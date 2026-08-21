import { useState } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";

import { AppText } from "@/components/ui";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  return (
    <>
      <Pressable style={styles.trigger} onPress={() => setIsOpen(true)}>
        <AppText style={styles.triggerText}>
          {selectedLanguage.flag} {selectedLanguage.label} ▾
        </AppText>
      </Pressable>

      <Modal transparent visible={isOpen} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <Pressable style={styles.sheet}>
            <AppText style={styles.title}>Choose language</AppText>

            {languages.map((language) => {
              const isSelected = language.code === selectedLanguage.code;

              return (
                <Pressable
                  key={language.code}
                  style={styles.option}
                  onPress={() => {
                    setSelectedLanguage(language);
                    setIsOpen(false);
                  }}
                >
                  <AppText style={styles.optionText}>
                    {language.flag} {language.label}
                  </AppText>

                  {isSelected && <AppText style={styles.check}>✓</AppText>}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.65)",
    borderWidth: 1,
    borderColor: "rgba(166,120,104,0.22)",
  },
  triggerText: {
    fontSize: 15,
    color: "#A67868",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(47,36,29,0.22)",
  },
  sheet: {
    margin: 18,
    padding: 22,
    borderRadius: 30,
    backgroundColor: "#FFF8EF",
  },
  title: {
    marginBottom: 14,
    fontSize: 22,
    fontWeight: "700",
    color: "#6F5548",
  },
  option: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: {
    fontSize: 18,
    color: "#6F5548",
  },
  check: {
    fontSize: 18,
    color: "#A67868",
  },
});
