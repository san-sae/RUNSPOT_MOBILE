import { Ionicons } from "@expo/vector-icons";
import { NaverMapViewRef } from "@mj-studio/react-native-naver-map";
import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Input } from "../common/Input/Input";
import TextField from "../common/textfield";

import { styles } from "./styles/DrawRunningCourseModal.styles";

import BackSvg from "@/src/assets/icon/back.svg";
import { Button } from "@/src/components/common/button/Button";
import type { MarkerType } from "@/src/components/common/map/NaverMapComponent";
import { NaverMapComponent } from "@/src/components/common/map/NaverMapComponent";
import { colors, spacing } from "@/src/constants";
import { useCurrentLocation } from "@/src/hooks/search/useCurrentLocation";
import { Markers } from "@/src/types/api/createSession";
import type { RoutePolyline } from "@/src/types/domain/createSessionDraft";
import { getPlaceNameFromCoordinates } from "@/src/utils/reverseGeocode";

export interface DrawCourseResult {
  routePolyline: RoutePolyline;
  markers: Markers;
  locationName: string;
  targetDistanceKm: string;
}

export interface DrawCourseModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (result: DrawCourseResult) => void;
  // 이미 데이터가 있을 경우
  initialData?: DrawCourseResult;
}

const DEFAULT_CAMERA = { latitude: 37.5665, longitude: 126.978, zoom: 14 };

function toDistanceKm(path: RoutePolyline): string {
  if (path.length < 2) return "";

  const earthRadius = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  let totalMeter = 0;

  for (let i = 1; i < path.length; i += 1) {
    const prev = path[i - 1];
    const curr = path[i];
    const lat1 = toRad(prev.y);
    const lat2 = toRad(curr.y);
    const dLat = lat2 - lat1;
    const dLon = toRad(curr.x - prev.x);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    totalMeter += earthRadius * c;
  }

  return (Math.round((totalMeter / 1000) * 100) / 100).toString();
}

/**
 * 러닝 코스 그리기 화면.
 * 지도 탭 좌표를 routePolyline에 누적하고 파생 필드를 스토어에 동기화
 */

export default function DrawCourseModal({
  visible,
  onClose,
  onApply,
  initialData,
}: DrawCourseModalProps) {
  const mapRef = useRef<NaverMapViewRef>(null);
  const [isMovingToLocation, setIsMovingToLocation] = useState(false);
  const { camera: currentLocationCamera } = useCurrentLocation();
  const [routePolyline, setRoutePolyline] = useState<RoutePolyline>([]);
  const [markers, setMarkers] = useState<Markers>([]);
  const [locationName, setLocationName] = useState("");
  const [targetDistanceKm, setTargetDistanceKm] = useState("");
  const [editingMarkerId, setEditingMarkerId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });

  const handleClear = useCallback(() => {
    setRoutePolyline([]);
    setMarkers([]);
    setLocationName("");
    setTargetDistanceKm("");
    setEditingMarkerId(null);
  }, []);

  const handleCloseModal = () => {
    handleClear();
    onClose();
  };

  useEffect(() => {
    if (visible && initialData) {
      setRoutePolyline(initialData.routePolyline);
      setMarkers(initialData.markers);
      setLocationName(initialData.locationName);
      setTargetDistanceKm(initialData.targetDistanceKm);
    } else if (visible && !initialData) {
      handleClear();
    }
  }, [visible, initialData, handleClear]);

  useEffect(() => {
    if (editingMarkerId !== null) {
      const targetMarker = markers.find((m) => m.id === editingMarkerId);

      if (targetMarker) {
        setEditForm({
          title: targetMarker.title,

          description: targetMarker.description,
        });
      }
    }
  }, [editingMarkerId, markers]);

  const handleSaveMarkerInfo = () => {
    setMarkers((prev) =>
      prev.map((m) =>
        m.id === editingMarkerId
          ? { ...m, title: editForm.title, description: editForm.description }
          : m,
      ),
    );

    setEditingMarkerId(null);
  };

  const handleCancelMarkerInfo = () => {
    setEditingMarkerId(null);
  };

  // 네이버 지도 API 포맷에 맞게 변환
  const routePath = useMemo(
    () => routePolyline.map((p) => ({ latitude: p.y, longitude: p.x })),
    [routePolyline],
  );

  const displayMarkers = useMemo<MarkerType[]>(() => {
    if (markers.length === 0) return [];

    return markers.map((marker, index) => {
      let defaultCaption = "";
      if (index === 0) {
        defaultCaption = "출발";
      } else if (index === markers.length - 1 && markers.length > 1) {
        defaultCaption = "도착";
      }

      const finalCaption =
        marker.title.trim() !== "" ? marker.title : defaultCaption;

      return {
        id: String(marker.id),
        latitude: marker.y,
        longitude: marker.x,
        caption: finalCaption,
        onTap: () => setEditingMarkerId(marker.id),
      };
    });
  }, [markers]);

  const camera = useMemo(() => {
    if (routePolyline.length > 0) {
      const first = routePolyline[0];

      return { latitude: first.y, longitude: first.x, zoom: 15 };
    }

    return currentLocationCamera ?? DEFAULT_CAMERA;
  }, [routePolyline, currentLocationCamera]);

  const isLoadingLocation =
    routePolyline.length === 0 && currentLocationCamera === null;

  const startLng = routePolyline[0]?.x;
  const startLat = routePolyline[0]?.y;

  useEffect(() => {
    if (startLng === undefined || startLat === undefined) return;

    let cancelled = false;

    getPlaceNameFromCoordinates(startLng, startLat).then((name) => {
      if (!cancelled) {
        setLocationName(name);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [startLng, startLat]);

  const handleMapTap = useCallback(
    (lat: number, lng: number) => {
      const nextRoute = [...routePolyline, { x: lng, y: lat }];
      const markerId = Date.now();

      if (routePolyline.length > 0) {
        const lastPoint = routePolyline[routePolyline.length - 1];
        const addedDistance = toDistanceKm([lastPoint, { x: lng, y: lat }]);
        const newTotal = Number(targetDistanceKm || 0) + Number(addedDistance);
        setTargetDistanceKm((Math.round(newTotal * 100) / 100).toString());
      } else {
        setTargetDistanceKm("0");
      }

      setMarkers((prev) => [
        ...prev,
        {
          id: markerId,
          x: lng,
          y: lat,
          title: "",
          description: "",
        },
      ]);

      setRoutePolyline(nextRoute);
      setEditingMarkerId(markerId);
    },
    [routePolyline, targetDistanceKm],
  );

  const placeNameLabel =
    locationName || (routePolyline.length > 0 ? "장소명 조회 중..." : "-");

  const handleMoveToCurrentLocation = async () => {
    if (isMovingToLocation) return;

    try {
      setIsMovingToLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "위치 권한 필요",

          "현재 위치로 이동하려면 위치 권한이 필요합니다.",
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;

      mapRef.current?.animateCameraTo({
        latitude,
        longitude,
        zoom: 15,
        duration: 500,
      });
    } catch {
      Alert.alert("위치 오류", "현재 위치를 가져오지 못했습니다.");
    } finally {
      setIsMovingToLocation(false);
    }
  };

  const handleApply = () => {
    if (routePolyline.length < 2) {
      Alert.alert("코스 미완성", "2개 이상의 포인트를 찍어주세요.");
      return;
    }

    onApply({
      routePolyline,
      markers,
      locationName,
      targetDistanceKm,
    });
  };

  if (!visible) return null;

  if (isLoadingLocation) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={colors.main} />
        <Text style={styles.loadingText}>{"현재 위치를 찾고 있습니다"}</Text>
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.root}>
        <View style={styles.header}>
          {/* 좌측: 뒤로가기(닫기) 버튼 */}
          <Button
            onPress={handleCloseModal}
            style={styles.headerLeft}
            variant="text"
            iconOnly
          >
            <BackSvg width={24} height={24} color={colors.gray900} />
          </Button>

          <Text style={styles.headerTitle}>코스 그리기</Text>

          <View style={styles.headerRight} />
        </View>

        <NaverMapComponent
          ref={mapRef}
          camera={camera}
          markers={displayMarkers}
          routePath={routePath}
          isScrollGesturesEnabled
          isZoomGesturesEnabled
          onMapTap={handleMapTap}
          style={styles.mapWrap}
        />

        <Pressable
          style={styles.myLocationButton}
          onPress={handleMoveToCurrentLocation}
          disabled={isMovingToLocation}
          accessibilityRole="button"
          accessibilityLabel="현재 위치로 이동"
        >
          {isMovingToLocation ? (
            <ActivityIndicator size="small" color={colors.main} />
          ) : (
            <Ionicons name="locate" size={22} color={colors.main} />
          )}
        </Pressable>

        {editingMarkerId !== null ? (
          <View style={styles.editBottomSheet}>
            <View style={styles.handleBarWrap}>
              <View style={styles.handleBar} />
            </View>

            <Input
              label="별칭"
              placeholder="코스 별명을 입력하세요"
              value={editForm.title}
              onChangeText={(text) =>
                setEditForm((prev) => ({ ...prev, title: text }))
              }
            />

            <View style={{ marginTop: spacing.sm }}>
              <TextField
                label="상세내용"
                placeholder="코스에 대한 상세한 설명을 적어주세요."
                value={editForm.description}
                onChangeText={(text) =>
                  setEditForm((prev) => ({ ...prev, description: text }))
                }
                minRows={4}
                variant="secondary"
              />
            </View>

            {/* 저장/취소 액션 버튼 */}
            <View style={[styles.actionRow, { marginTop: spacing.md }]}>
              <Button
                variant="outline"
                size="sm"
                flex
                onPress={handleCancelMarkerInfo}
              >
                취소
              </Button>

              <Button
                variant="primary"
                size="sm"
                flex
                onPress={handleSaveMarkerInfo}
              >
                확인
              </Button>
            </View>
          </View>
        ) : (
          <View style={styles.bottomSheet}>
            <Text style={styles.note}>
              지도를 탭해 코스를 그리세요. 첫 좌표를 출발지로 저장하고, 전체
              경로 길이를 목표 거리로 반영합니다.
            </Text>

            <View style={styles.metaBox}>
              <Text style={styles.metaText}>장소명: {placeNameLabel}</Text>

              <Text style={styles.metaText}>
                거리(km): {targetDistanceKm || "-"}
              </Text>

              <Text style={styles.metaText}>
                포인트 수: {routePolyline.length}
              </Text>
            </View>

            <View style={styles.actionRow}>
              <Button variant="outline" size="sm" flex onPress={handleClear}>
                초기화
              </Button>

              <Button variant="primary" size="sm" flex onPress={handleApply}>
                적용하고 돌아가기
              </Button>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}
