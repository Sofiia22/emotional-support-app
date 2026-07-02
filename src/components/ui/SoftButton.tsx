import { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

import { colors, radius, spacing } from "@/shared/theme";

type SoftButtonVariant = "primary" | "secondary";

type SoftButtonProps = PressableProps & {
  title: string;
  variant?: SoftButtonVariant;
  leftIcon?: ReactNode;
  isLoading?: boolean;
  style?: ViewStyle;
};

export function SoftButton({
  title,
  variant = "primary",
  leftIcon,
  isLoading = false,
  disabled,
  style,
  ...props
}: SoftButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" ? styles.primary : styles.secondary,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={
            variant === "primary" ? colors.surface.white : colors.text.primary
          }
        />
      ) : (
        <>
          {leftIcon}
          <Text
            style={
              variant === "primary" ? styles.primaryText : styles.secondaryText
            }
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  primary: {
    backgroundColor: colors.text.primary,
    shadowColor: colors.text.primary,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  secondary: {
    backgroundColor: colors.surface.whiteTransparent,
    borderWidth: 1,
    borderColor: colors.text.soft,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.55,
  },
  primaryText: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.surface.white,
  },
  secondaryText: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text.primary,
  },
});
