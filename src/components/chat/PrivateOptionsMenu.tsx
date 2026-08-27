import { memo } from "react";
import { View, Text, Modal, Pressable } from "react-native";

import { chatStyles as styles } from "./styles/chat.styles";

import ExitIcon from "@/src/assets/icon/chat/exit.svg";
import FlagIcon from "@/src/assets/icon/chat/flag.svg";
import { colors } from "@/src/constants";

export const PrivateOptionsMenu = memo(
  ({
    visible,
    onClose,
    onLeave,
    onReport,
  }: {
    visible: boolean;
    onClose: () => void;
    onLeave: () => void;
    onReport: () => void;
  }) => (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.dropdownMenu}>
          <Pressable style={styles.menuItem} onPress={onLeave}>
            <ExitIcon width={20} height={20} />
            <Text style={styles.menuText}>채팅방 나가기</Text>
          </Pressable>
          <View style={styles.menuDivider} />
          <Pressable style={styles.menuItem} onPress={onReport}>
            <FlagIcon width={20} height={20} />
            <Text style={[styles.menuText, { color: colors.red }]}>
              신고하기
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  ),
);
PrivateOptionsMenu.displayName = "PrivateOptionsMenu";
