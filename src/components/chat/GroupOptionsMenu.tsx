import { memo } from "react";
import { View, Text, Modal, Pressable } from "react-native";

import { chatStyles as styles } from "./styles/chat.styles";

import ExitIcon from "@/src/assets/icon/chat/exit.svg";
import MegaphoneIcon from "@/src/assets/icon/chat/megaphone.svg";
import TrashIcon from "@/src/assets/icon/chat/trash.svg";
import { colors } from "@/src/constants";

interface GroupOptionsMenuProps {
  visible: boolean;
  isHost: boolean;
  onClose: () => void;
  onLeave: () => void;
  onRegisterNotice: () => void;
  onDeleteRoom: () => void;
}

export const GroupOptionsMenu = memo(
  ({
    visible,
    isHost,
    onClose,
    onLeave,
    onRegisterNotice,
    onDeleteRoom,
  }: GroupOptionsMenuProps) => (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.dropdownMenu}>
          {isHost ? (
            <>
              <Pressable style={styles.menuItem} onPress={onRegisterNotice}>
                <MegaphoneIcon width={20} height={20} />
                <Text style={styles.menuText}>고정 공지 등록</Text>
              </Pressable>
              <View style={styles.menuDivider} />
              <Pressable style={styles.menuItem} onPress={onDeleteRoom}>
                <TrashIcon width={20} height={20} />
                <Text style={[styles.menuText, { color: colors.red }]}>
                  채팅방 삭제
                </Text>
              </Pressable>
            </>
          ) : (
            <Pressable style={styles.menuItem} onPress={onLeave}>
              <ExitIcon width={20} height={20} />
              <Text style={[styles.menuText, { color: colors.red }]}>
                채팅방 나가기
              </Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    </Modal>
  ),
);
GroupOptionsMenu.displayName = "GroupOptionsMenu";
