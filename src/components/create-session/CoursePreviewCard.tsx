import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

import CloseIcon from "@/src/assets/icon/cancel.svg";
import PinIcon from "@/src/assets/icon/create-session/pin.svg";
import { Button } from "@/src/components/common/button/Button";
import { NaverMapComponent } from "@/src/components/common/map/NaverMapComponent";
import { colors, spacing, fontSizes, borderRadius } from "@/src/constants";
import type { RoutePolyline } from "@/src/types/domain/createSessionDraft";

interface CoursePreviewCardProps {
  title: string;
  distance: string;
  pace?: string;
  address?: string;
  routePolyline: RoutePolyline;
  onClear: () => void;
  onLoadPress: () => void;
  onDrawPress: () => void;
}

export default function CoursePreviewCard({
  title,
  distance,
  pace,
  address,
  routePolyline,
  onClear,
  onLoadPress,
  onDrawPress,
}: CoursePreviewCardProps) {
  const routePath = useMemo(
    () => routePolyline.map((p) => ({ latitude: p.y, longitude: p.x })),
    [routePolyline],
  );

  const mapCamera = useMemo(() => {
    if (routePath.length > 0) {
      return {
        latitude: routePath[0].latitude,
        longitude: routePath[0].longitude,
        zoom: 11,
      };
    }
    return undefined;
  }, [routePath]);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {title || "사용자 지정 코스"}
        </Text>
        <Button
          variant="text"
          iconOnly
          onPress={onClear}
          startIcon={
            <CloseIcon width={18} height={18} color={colors.gray500} />
          }
          wrapperStyle={styles.closeButton}
          hitSlop={8}
        />
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>총 거리</Text>
          <Text style={styles.infoValue}>{distance}km</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>평균 페이스</Text>
          <Text style={styles.infoValueText}>
            {pace ? `${pace}/km` : "- /km"}
          </Text>
        </View>
      </View>

      {address && (
        <View style={styles.addressRow}>
          <PinIcon width={16} height={16} color={colors.main} />
          <View style={styles.addressTextContainer}>
            <Text style={styles.addressTitle}>
              {address.split(" ")[0]} {address.split(" ")[1]}
            </Text>
            <Text style={styles.addressDesc} numberOfLines={1}>
              {address}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.mapContainer} pointerEvents="none">
        <NaverMapComponent
          camera={mapCamera}
          routePath={routePath}
          isScrollGesturesEnabled={false}
          isZoomGesturesEnabled={false}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      <View style={styles.actionRow}>
        <Button variant="outline" size="sm" flex onPress={onLoadPress}>
          러닝 코스 불러오기
        </Button>
        <Button variant="outline" size="sm" flex onPress={onDrawPress}>
          지도 러닝 코스 그리기
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: fontSizes.base,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    padding: spacing.xxs,
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
  },
  infoRow: { flexDirection: "row", marginTop: spacing.md, gap: spacing.base },
  infoBlock: { flex: 1 },
  infoLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: { fontSize: fontSizes.sm, fontWeight: "600", color: colors.main },
  infoValueText: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
    color: colors.text,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  addressRow: {
    flexDirection: "row",
    marginTop: spacing.base,
    gap: spacing.xs,
    alignItems: "flex-start",
  },
  addressTextContainer: { flex: 1 },
  addressTitle: {
    fontSize: fontSizes.sm,
    fontWeight: "700",
    color: colors.text,
  },
  addressDesc: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  mapContainer: {
    height: 140,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    marginTop: spacing.base,
    backgroundColor: colors.bgSecondary,
  },
  actionRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.base },
});
