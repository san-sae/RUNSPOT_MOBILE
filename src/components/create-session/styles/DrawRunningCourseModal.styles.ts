import { Platform, StyleSheet } from "react-native";

import { colors, fontSizes, spacing } from "@/src/constants";

export const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg,
    gap: spacing.sm,
  },

  loadingText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },

  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  mapWrap: {
    flex: 1,
  },

  myLocationButton: {
    position: "absolute",
    right: spacing.base,
    bottom: 220,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.bg,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    ...Platform.select({
      android: { elevation: 6 },
    }),
  },

  bottomSheet: {
    position: "absolute",
    left: spacing.base,
    right: spacing.base,
    bottom: spacing.base,
    borderRadius: 12,
    backgroundColor: colors.bg,
    padding: spacing.base,
    gap: spacing.sm,
    zIndex: 10,
    ...Platform.select({
      android: { elevation: 8 },
    }),
  },

  note: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  metaBox: {
    width: "100%",
    gap: spacing.xs,
  },

  metaText: {
    fontSize: fontSizes.xs,
    color: colors.text,
  },

  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
    width: "100%",
  },

  editBottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxxl,
    zIndex: 10,

    ...Platform.select({
      android: { elevation: 15 },
    }),
  },

  handleBarWrap: {
    width: "100%",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },

  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: spacing.base,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  headerLeft: {
    width: 40,
    alignItems: "flex-start",
  },

  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: "600",
    color: colors.text,
  },

  headerRight: {
    width: 40,
    alignItems: "flex-end",
  },

  headerRightText: {
    fontSize: fontSizes.md,
    fontWeight: "600",
    color: colors.main,
  },
});
