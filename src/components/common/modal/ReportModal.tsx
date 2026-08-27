import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Button } from "@/src/components/common/button/Button";
import { colors, fontSizes, fontWeights, spacing } from "@/src/constants";

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
  targetName?: string;
}

const REPORT_REASONS = [
  "스팸 및 홍보성 내용",
  "욕설 및 불쾌한 표현",
  "음란물 및 부적절한 콘텐츠",
  "기타 (직접 입력)",
];

export function ReportModal({
  visible,
  onClose,
  onSubmit,
  targetName,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState("");

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSelectedReason(null);
      setDetails("");
    }, 300);
  };

  const handleSubmit = () => {
    if (!selectedReason) return;
    onSubmit(selectedReason, details);

    setTimeout(() => {
      setSelectedReason(null);
      setDetails("");
    }, 300);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>신고하기</Text>
            <Pressable onPress={handleClose} hitSlop={8}>
              <Ionicons name="close" size={24} color={colors.gray600} />
            </Pressable>
          </View>

          {targetName && (
            <Text style={styles.subtitle}>
              <Text style={{ fontWeight: fontWeights.bold }}>{targetName}</Text>
              님을 신고하는 이유를 선택해주세요.
            </Text>
          )}

          {/* 사유 선택 리스트 */}
          <View style={styles.reasonList}>
            {REPORT_REASONS.map((reason) => (
              <Pressable
                key={reason}
                style={styles.reasonRow}
                onPress={() => setSelectedReason(reason)}
              >
                <Ionicons
                  name={
                    selectedReason === reason
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={20}
                  color={
                    selectedReason === reason ? colors.main : colors.gray400
                  }
                />
                <Text
                  style={[
                    styles.reasonText,
                    selectedReason === reason && styles.reasonTextSelected,
                  ]}
                >
                  {reason}
                </Text>
              </Pressable>
            ))}
          </View>

          {selectedReason === "기타 (직접 입력)" && (
            <TextInput
              style={styles.detailsInput}
              placeholder="신고 사유를 상세히 적어주세요. (최대 100자)"
              placeholderTextColor={colors.gray400}
              multiline
              maxLength={100}
              value={details}
              onChangeText={setDetails}
            />
          )}

          <Button
            variant="primary"
            fullWidth
            disabled={
              !selectedReason ||
              (selectedReason === "기타 (직접 입력)" && !details.trim())
            }
            onPress={handleSubmit}
            wrapperStyle={{ marginTop: spacing.md }}
          >
            신고 접수
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContainer: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    paddingBottom: Platform.OS === "ios" ? 40 : spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.gray600,
    marginBottom: spacing.md,
  },
  reasonList: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  reasonText: {
    fontSize: fontSizes.base,
    color: colors.gray800,
  },
  reasonTextSelected: {
    color: colors.main,
    fontWeight: fontWeights.semibold,
  },
  detailsInput: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
    padding: spacing.md,
    minHeight: 80,
    textAlignVertical: "top",
    fontSize: fontSizes.sm,
    color: colors.text,
    marginBottom: spacing.md,
  },
});
