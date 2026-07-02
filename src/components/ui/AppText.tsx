import { StyleSheet, Text, TextProps } from "react-native";

import { colors, typography } from "@/shared/theme";

type Variant = "display" | "h1" | "h2" | "body" | "caption" | "button";

interface AppTextProps extends TextProps {
  variant?: Variant;
}

export function AppText({
  variant = "body",
  style,
  children,
  ...props
}: AppTextProps) {
  return (
    <Text style={[styles.base, typography[variant], style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.text.primary,
  },
});
