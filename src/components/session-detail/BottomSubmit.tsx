import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";

import { joinSession } from "@/src/api/session-detail/sessionDetailApi.index";
import InfoIcon from "@/src/assets/icon/session-detail/info.svg";
import { Input } from "@/src/components/common/Input/Input";
import { Button } from "@/src/components/common/button/Button";
import { colors, fontSizes, fontWeights, spacing } from "@/src/constants";
import { formatPaceDisplay } from "@/src/utils";
import { AnalyticsHelper } from "@/src/utils/analytics";

interface BottomSubmitProps {
  sessionId: number;
  isPastSession?: boolean;
}

export function BottomSubmit({ sessionId, isPastSession }: BottomSubmitProps) {
  const [pace, setPace] = useState("");
  const [message, setMessage] = useState("");
  const [paceError, setPaceError] = useState("");

  const router = useRouter();

  const joinMutation = useMutation({
    mutationFn: (msg: string) => joinSession(sessionId, msg),
    onSuccess: async () => {
      // [Analytics] 러닝 참여 신청 트래픽 기록
      await AnalyticsHelper.logEvent("request_join", {
        session_id: String(sessionId),
        has_message: message.trim().length > 0, // 메시지 작성 여부 추적
      });

      Alert.alert(
        "신청 완료",
        "호스트에게 참여 신청이 전달되었습니다!\n호스트가 수락하면 단체 채팅방에 자동 초대됩니다.",
        [
          {
            text: "확인",
            onPress: () => router.push("/(main)"),
          },
        ],
      );
    },
    onError: (err) => {
      Alert.alert("신청에 실패했어요", "잠시 후 다시 시도해주세요.");
      console.warn("신청 실패: ", err);
    },
  });

  const handlePaceChange = useCallback(
    (text: string) => {
      if (paceError) {
        setPaceError("");
      }
      setPace(formatPaceDisplay(text));
    },
    [paceError],
  );

  const handleApply = () => {
    if (isPastSession) {
      Alert.alert("신청 불가", "이미 시작 시간이 지난 러닝 모임입니다.");
      return;
    }

    if (!pace.trim()) {
      setPaceError("나의 평균 페이스를 입력해주세요.");
      return;
    }

    joinMutation.mutate(message);
  };

  const getButtonText = () => {
    if (isPastSession) return "마감된 모임입니다";
    if (joinMutation.isPending) return "신청 중";
    return "참여 신청하기";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>참여 신청서 작성</Text>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>나의 평균 페이스</Text>
        <Input
          value={pace}
          onChangeText={handlePaceChange}
          placeholder="5:00 min/km"
          keyboardType="numbers-and-punctuation"
          editable={!isPastSession}
          containerStyle={styles.inputContainerStyle}
          errorMessage={paceError}
        />
      </View>

      <Input
        editable={!isPastSession}
        placeholder={
          isPastSession
            ? "마감된 모임에는 작성할 수 없습니다."
            : "호스트에게 한마디 (선택)"
        }
        value={message}
        onChangeText={setMessage}
        wrapperStyle={styles.inputWrapper}
      />

      <View style={styles.noticeBox}>
        <InfoIcon width={18} height={18} />
        <Text style={styles.noticeText}>
          호스트가 수락하면 단체 채팅방에 자동으로 초대됩니다.
        </Text>
      </View>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onPress={handleApply}
        disabled={joinMutation.isPending || isPastSession}
        wrapperStyle={{ marginTop: spacing.md }}
      >
        {getButtonText()}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  formField: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputContainerStyle: {
    borderRadius: 8,
    borderColor: colors.gray200,
  },
  inputWrapper: {
    minHeight: 80,
  },
  textFieldContainerStyle: {
    borderRadius: 8,
  },
  noticeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray100,
    padding: spacing.md,
    borderRadius: 8,
    gap: spacing.xs,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: colors.gray600,
    lineHeight: 16,
  },
});
