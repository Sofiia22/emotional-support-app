import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui";
import { languages } from "@/shared/i18n/translations";
import { useApp } from "@/shared/state/AppProvider";

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, copy } = useApp();
  const selectedLanguage =
    languages.find((item) => item.code === language) ?? languages[0];

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={copy.common.chooseLanguage}
        style={[styles.trigger, compact && styles.compactTrigger]}
        onPress={() => setIsOpen(true)}
      >
        <AppText style={styles.triggerText}>
          {selectedLanguage.flag} {compact ? selectedLanguage.code.toUpperCase() : selectedLanguage.label} ▾
        </AppText>
      </Pressable>

      <Modal
        transparent
        visible={isOpen}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View style={styles.sheet}>
            <AppText style={styles.title}>{copy.common.chooseLanguage}</AppText>

            {languages.map((language) => {
              const isSelected = language.code === selectedLanguage.code;

              return (
                <Pressable
                  key={language.code}
                  accessibilityRole="button"
                  accessibilityLabel={language.label}
                  accessibilityState={{ selected: isSelected }}
                  style={styles.option}
                  onPress={() => {
                    setLanguage(language.code);
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
          </View>
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
  compactTrigger: {
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    shadowColor: "#5B4035",
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
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
