import { Href, useRouter } from "expo-router";
import { ReactNode, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LanguageSelector } from "@/components/common/LanguageSelector";
import { AppText, SoftButton } from "@/components/ui";
import { useApp } from "@/shared/state/AppProvider";

export type AppSection = "home" | "journal" | "library" | "breathe" | "support";

type AppScaffoldProps = {
  active: AppSection;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  scroll?: boolean;
};

const navItems: {
  section: AppSection;
  path: "/home" | "/journal" | "/library" | "/breathe" | "/support";
  icon: string;
}[] = [
  { section: "home", path: "/home", icon: "⌂" },
  { section: "journal", path: "/journal", icon: "✎" },
  { section: "library", path: "/library", icon: "▤" },
  { section: "breathe", path: "/breathe", icon: "◌" },
  { section: "support", path: "/support", icon: "♡" },
];

export function AppScaffold({
  active,
  title,
  subtitle,
  children,
  scroll = true,
}: AppScaffoldProps) {
  const router = useRouter();
  const { copy, user, logout } = useApp();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const content = (
    <View style={styles.content}>
      {(title || subtitle) && (
        <View style={styles.titleBlock}>
          {title ? <AppText style={styles.title}>{title}</AppText> : null}
          {subtitle ? (
            <AppText style={styles.subtitle}>{subtitle}</AppText>
          ) : null}
        </View>
      )}
      {children}
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.peachBlob} />
      <View style={styles.blueBlob} />
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <View>
            <AppText style={styles.brand}>{copy.common.brand}</AppText>
            <AppText style={styles.tagline}>{copy.common.tagline}</AppText>
          </View>
          <View style={styles.headerActions}>
            <LanguageSelector compact />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={copy.common.profile}
              style={styles.profileButton}
              onPress={() => setIsProfileOpen(true)}
            >
              <AppText style={styles.profileInitial}>
                {(user?.name || "P").slice(0, 1).toUpperCase()}
              </AppText>
            </Pressable>
          </View>
        </View>

        {scroll ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {content}
          </ScrollView>
        ) : (
          <View style={styles.fixedContent}>{content}</View>
        )}

        <View style={styles.bottomNav}>
          {navItems.map((item) => {
            const label = copy.common[item.section];
            const isActive = item.section === active;

            return (
              <Pressable
                key={item.section}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected: isActive }}
                style={styles.navItem}
                onPress={() => router.replace(item.path as Href)}
              >
                <View style={[styles.navIcon, isActive && styles.navIconActive]}>
                  <AppText
                    style={[styles.navGlyph, isActive && styles.navGlyphActive]}
                  >
                    {item.icon}
                  </AppText>
                </View>
                <AppText
                  numberOfLines={1}
                  style={[styles.navLabel, isActive && styles.navLabelActive]}
                >
                  {label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>

      <Modal
        transparent
        visible={isProfileOpen}
        animationType="fade"
        onRequestClose={() => setIsProfileOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsProfileOpen(false)}
        >
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <AppText style={styles.profileAvatarText}>
                {(user?.name || "P").slice(0, 1).toUpperCase()}
              </AppText>
            </View>
            <AppText style={styles.profileTitle}>{copy.profile.title}</AppText>
            <AppText style={styles.profileName}>{user?.name}</AppText>
            <AppText style={styles.profileEmail}>{user?.email}</AppText>
            <AppText style={styles.memberLabel}>{copy.profile.member}</AppText>

            <View style={styles.profileSection}>
              <AppText style={styles.profileSectionTitle}>
                {copy.profile.language}
              </AppText>
              <LanguageSelector />
            </View>

            <View style={styles.privacyCard}>
              <AppText style={styles.profileSectionTitle}>
                {copy.profile.privacy}
              </AppText>
              <AppText style={styles.privacyText}>
                {copy.profile.privacyText}
              </AppText>
            </View>

            <SoftButton
              title={copy.profile.settings}
              variant="secondary"
              onPress={() => {
                setIsProfileOpen(false);
                router.push("/settings" as Href);
              }}
            />

            <View style={styles.logoutButton}>
              <SoftButton
                title={copy.common.logout}
                variant="secondary"
                onPress={() => {
                  logout();
                  setIsProfileOpen(false);
                  router.replace("/");
                }}
              />
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
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
    top: -150,
    left: -150,
    width: 390,
    height: 390,
    borderRadius: 195,
    backgroundColor: "#FAD7C3",
    opacity: 0.42,
  },
  blueBlob: {
    position: "absolute",
    right: -180,
    bottom: -130,
    width: 430,
    height: 430,
    borderRadius: 215,
    backgroundColor: "#D8EEF4",
    opacity: 0.52,
  },
  header: {
    minHeight: 70,
    paddingHorizontal: 22,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    fontFamily: "serif",
    fontSize: 28,
    fontWeight: "700",
    color: "#6F5548",
  },
  tagline: {
    marginTop: -2,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#B9958B",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFFCC",
    borderWidth: 1,
    borderColor: "#E6CFC5",
  },
  profileInitial: {
    fontSize: 17,
    fontWeight: "700",
    color: "#8F6758",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  fixedContent: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
  },
  titleBlock: {
    marginTop: 12,
    marginBottom: 22,
  },
  title: {
    fontFamily: "serif",
    fontSize: 31,
    lineHeight: 38,
    fontWeight: "700",
    color: "#6F5548",
  },
  subtitle: {
    marginTop: 7,
    maxWidth: 340,
    fontSize: 15,
    lineHeight: 22,
    color: "#9B7A6C",
  },
  bottomNav: {
    minHeight: 76,
    paddingHorizontal: 14,
    paddingTop: 9,
    paddingBottom: 8,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(166,120,104,0.14)",
    backgroundColor: "rgba(255, 251, 246, 0.96)",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  navIcon: {
    width: 32,
    height: 30,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  navIconActive: {
    backgroundColor: "#F2D7CF",
  },
  navGlyph: {
    fontSize: 20,
    lineHeight: 23,
    color: "#B89D91",
  },
  navGlyphActive: {
    color: "#855F50",
  },
  navLabel: {
    marginTop: 2,
    maxWidth: 82,
    fontSize: 10,
    color: "#A89084",
  },
  navLabelActive: {
    fontWeight: "700",
    color: "#765448",
  },
  modalOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(52, 38, 31, 0.28)",
  },
  profileCard: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    padding: 24,
    borderRadius: 30,
    backgroundColor: "#FFF9F1",
    shadowColor: "#4C352C",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3D5CB",
  },
  profileAvatarText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#795648",
  },
  profileTitle: {
    marginTop: 12,
    textAlign: "center",
    fontFamily: "serif",
    fontSize: 24,
    fontWeight: "700",
  },
  profileName: {
    marginTop: 6,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
  profileEmail: {
    marginTop: 2,
    textAlign: "center",
    fontSize: 13,
    color: "#9B8578",
  },
  memberLabel: {
    marginTop: 5,
    textAlign: "center",
    fontSize: 12,
    color: "#B09386",
  },
  profileSection: {
    marginTop: 20,
    paddingTop: 17,
    borderTopWidth: 1,
    borderTopColor: "#ECDDD5",
  },
  profileSectionTitle: {
    marginBottom: 9,
    fontSize: 13,
    fontWeight: "700",
    color: "#795F53",
  },
  privacyCard: {
    marginVertical: 16,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#F3EDE3",
  },
  privacyText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#8F796F",
  },
  logoutButton: {
    marginTop: 9,
  },
});
