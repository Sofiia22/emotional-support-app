import { useState } from "react";
import { Alert, Linking, Pressable, StyleSheet, View } from "react-native";

import { AppScaffold } from "@/components/layout/AppScaffold";
import { AppText, SoftButton } from "@/components/ui";
import { supportResources } from "@/features/support/supportResources";
import { useRequireUser } from "@/shared/navigation/useRequireUser";
import { SupportRegion, useApp } from "@/shared/state/AppProvider";

type SupportCardProps = {
  icon: string;
  title: string;
  hint: string;
  tint: string;
};

function SupportCard({ icon, title, hint, tint }: SupportCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded }}
      style={({ pressed }) => [styles.supportCard, pressed && styles.pressed]}
      onPress={() => setIsExpanded((value) => !value)}
    >
      <View style={[styles.supportIcon, { backgroundColor: tint }]}>
        <AppText style={styles.supportGlyph}>{icon}</AppText>
      </View>
      <View style={styles.supportContent}>
        <AppText style={styles.supportTitle}>{title}</AppText>
        {isExpanded ? (
          <AppText style={styles.supportHint}>{hint}</AppText>
        ) : null}
      </View>
      <AppText style={styles.expandGlyph}>{isExpanded ? "−" : "+"}</AppText>
    </Pressable>
  );
}

export function SupportScreen() {
  const { user } = useRequireUser();
  const { copy, supportRegion, setSupportRegion } = useApp();

  if (!user) return null;

  const confirmCall = (number: string, label: string) => {
    Alert.alert(copy.support.urgentTitle, `${label}: ${number}\n\n${copy.support.urgentText}`, [
      { text: copy.common.cancel, style: "cancel" },
      {
        text: `${copy.support.callNumber} ${number}`,
        style: "destructive",
        onPress: () => Linking.openURL(`tel:${number}`),
      },
    ]);
  };

  return (
    <AppScaffold
      active="support"
      title={copy.support.title}
      subtitle={copy.support.subtitle}
    >
      <View style={styles.list}>
        <SupportCard
          icon="♡"
          title={copy.support.trusted}
          hint={copy.support.trustedHint}
          tint="#F5DCD8"
        />
        <SupportCard
          icon="✚"
          title={copy.support.specialist}
          hint={copy.support.specialistHint}
          tint="#DCECEE"
        />
        <SupportCard
          icon="?"
          title={copy.support.faq}
          hint={copy.support.faqHint}
          tint="#E9E3F2"
        />
      </View>

      <View style={styles.regionCard}>
        <AppText style={styles.regionTitle}>{copy.support.regionTitle}</AppText>
        <AppText style={styles.regionHint}>{copy.support.regionHint}</AppText>
        <View style={styles.regionOptions}>
          {(Object.keys(copy.support.regions) as SupportRegion[]).map((region) => {
            const selected = supportRegion === region;
            return (
              <Pressable
                key={region}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={[styles.regionOption, selected && styles.regionOptionActive]}
                onPress={() => setSupportRegion(region)}
              >
                <AppText style={[styles.regionOptionText, selected && styles.regionOptionTextActive]}>
                  {copy.support.regions[region]}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.urgentCard}>
        <View style={styles.urgentHeader}>
          <View style={styles.urgentIcon}>
            <AppText style={styles.urgentGlyph}>!</AppText>
          </View>
          <AppText style={styles.urgentTitle}>{copy.support.urgentTitle}</AppText>
        </View>
        <AppText style={styles.urgentText}>{copy.support.urgentText}</AppText>
        {supportResources[supportRegion].length === 0 ? (
          <AppText style={styles.otherRegionText}>{copy.support.otherRegionText}</AppText>
        ) : (
          <View style={styles.resourceList}>
            {supportResources[supportRegion].map((resource) => {
              const label = resource.kind === "crisis"
                ? copy.support.crisisSupport
                : copy.support.emergencySupport;
              return (
                <View key={`${resource.kind}-${resource.number}`} style={styles.resourceCard}>
                  <View style={styles.resourceText}>
                    <AppText style={styles.resourceLabel}>{label}</AppText>
                    <Pressable
                      accessibilityRole="link"
                      onPress={() => Linking.openURL(resource.sourceUrl)}
                    >
                      <AppText style={styles.sourceLink}>{copy.support.officialSource} ↗</AppText>
                    </Pressable>
                  </View>
                  <SoftButton
                    title={`${copy.support.callNumber} ${resource.number}`}
                    onPress={() => confirmCall(resource.number, label)}
                  />
                </View>
              );
            })}
          </View>
        )}
      </View>

      <AppText style={styles.verifiedNotice}>{copy.support.verifiedNotice}</AppText>

      <View style={styles.disclaimerCard}>
        <AppText style={styles.disclaimer}>ⓘ {copy.support.disclaimer}</AppText>
      </View>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 11,
  },
  supportCard: {
    minHeight: 78,
    padding: 14,
    borderRadius: 23,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderWidth: 1,
    borderColor: "rgba(173,131,116,0.14)",
  },
  pressed: {
    opacity: 0.8,
  },
  supportIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  supportGlyph: {
    fontSize: 22,
    fontWeight: "700",
    color: "#77594D",
  },
  supportContent: {
    flex: 1,
    paddingHorizontal: 13,
  },
  supportTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700",
    color: "#71564A",
  },
  supportHint: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: "#998278",
  },
  expandGlyph: {
    fontSize: 22,
    color: "#B2978B",
  },
  urgentCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 28,
    backgroundColor: "rgba(250, 218, 218, 0.82)",
    borderWidth: 1,
    borderColor: "rgba(183, 91, 91, 0.2)",
  },
  urgentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  urgentIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#CB7777",
  },
  urgentGlyph: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  urgentTitle: {
    flex: 1,
    fontFamily: "serif",
    fontSize: 22,
    fontWeight: "700",
    color: "#8B4F4F",
  },
  urgentText: {
    marginVertical: 14,
    fontSize: 13,
    lineHeight: 20,
    color: "#915F5F",
  },
  regionCard: {
    marginTop: 18,
    padding: 17,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.78)",
  },
  regionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#72584D",
  },
  regionHint: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    color: "#9A8378",
  },
  regionOptions: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  regionOption: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "#F3E8E2",
  },
  regionOptionActive: {
    backgroundColor: "#7E6054",
  },
  regionOptionText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8A6F63",
  },
  regionOptionTextActive: {
    color: "#FFFFFF",
  },
  resourceList: {
    gap: 9,
  },
  resourceCard: {
    padding: 12,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.58)",
  },
  resourceText: {
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  resourceLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#854F4F",
  },
  sourceLink: {
    fontSize: 10,
    textDecorationLine: "underline",
    color: "#8B6666",
  },
  otherRegionText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
    color: "#865757",
  },
  verifiedNotice: {
    marginTop: 10,
    fontSize: 10,
    lineHeight: 15,
    color: "#9A8177",
  },
  disclaimerCard: {
    marginTop: 13,
    padding: 14,
    borderRadius: 17,
    backgroundColor: "rgba(239,234,226,0.76)",
  },
  disclaimer: {
    fontSize: 11,
    lineHeight: 17,
    color: "#84776F",
  },
});
