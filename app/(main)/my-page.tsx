import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ProfileSection,
  CreatedRunsSection,
  AppliedRunsSection,
  RecentHistorySection,
} from "../../src/components/mypage/Sections";

import { logoutUser } from "@/src/api/auth/logoutUser";
import { withdrawUser } from "@/src/api/auth/withdraswUser";
import RightArrowSvg from "@/src/assets/icon/my-page/rightarrow.svg";
import SettingSvg from "@/src/assets/icon/my-page/setting.svg";
import BellSvg from "@/src/assets/icon/notification/bell.svg";
import { Button } from "@/src/components/common//button/Button";
import { BannerAdComponent } from "@/src/components/common/admob/BannerAdComponent";
import {
  colors,
  spacing,
  fontSizes,
  fontWeights,
  zIndex,
  borderRadius,
} from "@/src/constants";
import { useMyPageQueries } from "@/src/hooks/mypage/useMyPageQueries";
import { AnalyticsHelper } from "@/src/utils/analytics";

export default function MyPageScreen() {
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const {
    profileData,
    createdRunsData,
    appliedRunsData,
    historyRunsData,
    isTotalLoading,
    refetchAppliedRuns,
    refetchCreatedRuns,
    refetchHistoryRuns,
    refetchProfile,
    isProfileError,
    isCreatedRunsError,
    isAppliedRunsError,
    isHistoryRunsError,
    isProfileFetching,
    isCreatedRunsFetching,
    isAppliedRunsFetching,
    isHistoryRunsFetching,
  } = useMyPageQueries();

  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      refetchProfile();
      refetchCreatedRuns();
      refetchAppliedRuns();
      refetchHistoryRuns();
    }, [
      refetchProfile,
      refetchCreatedRuns,
      refetchAppliedRuns,
      refetchHistoryRuns,
    ]),
  );

  const onRefresh = async () => {
    setIsManualRefreshing(true);
    await Promise.all([
      refetchProfile(),
      refetchCreatedRuns(),
      refetchAppliedRuns(),
      refetchHistoryRuns(),
    ]);
    setIsManualRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          await logoutUser({ queryClient });

          // 로그아웃 트래픽 기록
          await AnalyticsHelper.logEvent("logout", { method: "manual" });
          // 사용자 식별자 초기화
          await AnalyticsHelper.setUserId(null);

          setSettingsVisible(false);
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleWithdraw = () => {
    Alert.alert(
      "회원탈퇴",
      "정말 탈퇴하시겠습니까?\n모든 러닝 기록과 정보가 즉시 삭제되며 복구할 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴하기",
          style: "destructive",
          onPress: async () => {
            try {
              await withdrawUser({ queryClient });

              // 회원탈퇴 트래픽 기록
              await AnalyticsHelper.logEvent("account_deleted", {
                reason: "user_request",
              });
              // 사용자 식별자 초기화
              await AnalyticsHelper.setUserId(null);

              setSettingsVisible(false);

              Alert.alert("알림", "회원탈퇴가 완료되었습니다.");
              router.replace("/(auth)/login");
            } catch {
              Alert.alert(
                "오류",
                "회원탈퇴 처리 중 문제가 발생했습니다. 다시 시도해주세요.",
              );
            }
          },
        },
      ],
    );
  };

  if (isTotalLoading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.totalLoadingText}>
          러닝 정보를 불러오는 중입니다
        </Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <View style={styles.headerRight}>
          <Button
            variant="text"
            iconOnly
            onPress={() => router.push("/notifications")}
          >
            <BellSvg width={24} height={24} color={colors.text} />
          </Button>

          <Pressable onPress={() => setSettingsVisible(true)} hitSlop={10}>
            <SettingSvg width={24} height={24} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isManualRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <ProfileSection
          data={profileData}
          isFetching={isProfileFetching}
          isError={isProfileError}
          onRetry={refetchProfile}
        />
        <CreatedRunsSection
          data={createdRunsData}
          isFetching={isCreatedRunsFetching}
          isError={isCreatedRunsError}
          onRetry={refetchCreatedRuns}
        />
        <AppliedRunsSection
          data={appliedRunsData}
          isFetching={isAppliedRunsFetching}
          isError={isAppliedRunsError}
          onRetry={refetchAppliedRuns}
        />
        <RecentHistorySection
          data={historyRunsData}
          isFetching={isHistoryRunsFetching}
          isError={isHistoryRunsError}
          onRetry={refetchHistoryRuns}
        />

        <View style={styles.adWrapper}>
          <BannerAdComponent />
        </View>
      </ScrollView>

      <Modal
        visible={isSettingsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setSettingsVisible(false)}
          />

          <View style={styles.modalContent}>
            <Pressable style={styles.modalItem} onPress={handleLogout}>
              <Text style={styles.modalItemText}>로그아웃</Text>
              <RightArrowSvg
                width={20}
                height={20}
                color={colors.textSecondary}
              />
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.modalItem} onPress={handleWithdraw}>
              <Text style={styles.modalItemText}>회원탈퇴</Text>
              <RightArrowSvg
                width={20}
                height={20}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSecondary },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  scrollContent: { paddingBottom: spacing.xxl },
  adWrapper: {
    marginTop: spacing.xl,
    alignItems: "center",
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: zIndex.modal,
  },
  modalContent: {
    width: "80%",
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    overflow: "hidden",
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.base,
  },
  modalItemText: { fontSize: fontSizes.base, color: colors.text },
  divider: { height: 1, backgroundColor: colors.borderLight },
  totalLoadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
});
