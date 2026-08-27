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

import CloseIcon from "@/src/assets/icon/manage-Participants/reject.svg";
import { Button } from "@/src/components/common/button/Button";
import { colors, fontSizes, fontWeights, spacing } from "@/src/constants";

interface NoticeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (notice: string) => void;
}

export function NoticeModal({ visible, onClose, onSubmit }: NoticeModalProps) {
  const [noticeText, setNoticeText] = useState("");

  const handleClose = () => {
    onClose();
    setTimeout(() => setNoticeText(""), 300);
  };

  const handleSubmit = () => {
    if (!noticeText.trim()) return;
    onSubmit(noticeText.trim());
    setTimeout(() => setNoticeText(""), 300);
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
            <Text style={styles.title}>고정 공지 등록</Text>
            <Button
              variant="text"
              iconOnly
              onPress={handleClose}
              wrapperStyle={{ padding: 0 }}
            >
              <CloseIcon width={24} height={24} />
            </Button>
          </View>

          <Text style={styles.subtitle}>
            채팅방 상단에 고정될 공지사항을 입력해주세요.
          </Text>

          <TextInput
            style={styles.detailsInput}
            placeholder="예) 8월 14일 20시, 여의나루역 2번 출구"
            placeholderTextColor={colors.gray400}
            multiline
            maxLength={60}
            value={noticeText}
            onChangeText={setNoticeText}
            autoFocus
          />

          <Button
            variant="primary"
            fullWidth
            disabled={!noticeText.trim()}
            onPress={handleSubmit}
            wrapperStyle={{ marginTop: spacing.xs }}
          >
            등록하기
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
    marginBottom: spacing.xs,
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
  detailsInput: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
    padding: spacing.md,
    minHeight: 80,
    textAlignVertical: "top",
    fontSize: fontSizes.base,
    color: colors.text,
    marginBottom: spacing.md,
  },
});
