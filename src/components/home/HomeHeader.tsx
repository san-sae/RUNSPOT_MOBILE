import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LogoIcon from "@/src/assets/icon/brand/logo.svg";
import BellSvg from "@/src/assets/icon/notification/bell.svg";
import { Button } from "@/src/components/common/button/Button";
import { colors, fontSizes, fontWeights, spacing } from "@/src/constants";

export function HomeHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bleed,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <View
        style={[
          styles.row,
          {
            paddingLeft: Math.max(spacing.base, insets.left),
            paddingRight: Math.max(spacing.base, insets.right),
          },
        ]}
      >
        <View style={styles.left}>
          <LogoIcon width={56} height={56} />
          <View style={styles.greeting}>
            <Text style={styles.title}>반갑습니다, 회원님</Text>
            <Text style={styles.subtitle}>오늘도 즐겁게 달려보세요!</Text>
          </View>
        </View>
        <View style={styles.right}>
          <Button
            variant="text"
            iconOnly
            onPress={() => router.push("/notifications")}
          >
            <BellSvg width={24} height={24} />
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bleed: {
    width: "100%",
    alignSelf: "stretch",
    backgroundColor: colors.bg,
    borderBottomWidth: 2,
    borderBottomColor: colors.gray200,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 100,
    paddingBottom: spacing.sm,
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  greeting: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  right: {
    marginLeft: spacing.xs,
  },
});
