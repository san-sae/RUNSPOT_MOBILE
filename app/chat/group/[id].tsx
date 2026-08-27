import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useCallback, memo } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ListRenderItem,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MOCK_GROUP_MESSAGES } from "@/src/api/chat/chatApi.mock";
import BackIcon from "@/src/assets/icon/back.svg";
import MegaphoneIcon from "@/src/assets/icon/chat/megaphone.svg";
import MenuIcon from "@/src/assets/icon/chat/menu.svg";
import AddIcon from "@/src/assets/icon/chat/plus.svg";
import SendIcon from "@/src/assets/icon/chat/send.svg";
import { ChatBubble } from "@/src/components/chat/ChatBubble";
import { GroupOptionsMenu } from "@/src/components/chat/GroupOptionsMenu";
import { chatStyles as styles } from "@/src/components/chat/styles/chat.styles";
import { Button } from "@/src/components/common/button/Button";
import { NoticeModal } from "@/src/components/common/modal/NoticeModal";
import { colors } from "@/src/constants";
import { useChatInput } from "@/src/hooks/chat/useChatInput";
import { GroupMessage } from "@/src/types/api/chat";
import { AnalyticsHelper } from "@/src/utils/analytics";

const AnnouncementBar = memo(({ text }: { text: string }) => (
  <View style={styles.announcementContainer}>
    <MegaphoneIcon width={20} height={20} style={styles.announcementIcon} />
    <Text style={styles.announcementText} numberOfLines={1}>
      {text}
    </Text>
  </View>
));
AnnouncementBar.displayName = "AnnouncementBar";

export default function GroupChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [messages, setMessages] = useState<GroupMessage[]>(MOCK_GROUP_MESSAGES);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isNoticeModalVisible, setNoticeModalVisible] = useState(false);
  const [currentNotice, setCurrentNotice] = useState("");

  const isCurrentUserHost = false;

  const { inputText, setInputText, handleAttachPress } = useChatInput();

  const CURRENT_USER_ID = "me";
  const PARTICIPANT_COUNT = 5;

  const handleRegisterNotice = useCallback(
    (notice: string) => {
      // TODO: [API] 단체 채팅방 고정 공지사항 등록
      setCurrentNotice(notice);
      setNoticeModalVisible(false);

      // [Analytics] 고정 공지사항 등록 트래픽 기록
      AnalyticsHelper.logEvent("register_notice", { room_id: id });
    },
    [id],
  );

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;

    const newMessage: GroupMessage = {
      id: Date.now().toString(),
      senderId: CURRENT_USER_ID,
      senderName: "러너김",
      avatarChar: "김",
      role: "PARTICIPANT",
      content: inputText.trim(),
      time: "방금",
    };

    setMessages((prev) => [newMessage, ...prev]);
    setInputText("");

    // [Analytics] 채팅 메시지 전송 트래픽 기록
    AnalyticsHelper.logEvent("send_group_chat", {
      room_id: id || "unknown",
      message_length: inputText.length,
    });
  }, [inputText, id, setInputText]);

  const handleLongPressUser = useCallback(
    (targetMsg: GroupMessage) => {
      Alert.alert(
        "유저 액션",
        `${targetMsg.senderName}님을 신고하시겠습니까?`,
        [
          { text: "취소", style: "cancel" },
          {
            text: "신고하기",
            style: "destructive",
            onPress: () => {
              // [Analytics] 유저 신고 접수 트래픽 기록
              AnalyticsHelper.logEvent("report_user", {
                target_id: targetMsg.senderId,
                room_id: id,
              });
              Alert.alert(
                "신고 접수",
                "운영팀에 안전하게 신고 접수되었습니다.",
              );
            },
          },
        ],
      );
    },
    [id],
  );

  const renderItem: ListRenderItem<GroupMessage> = useCallback(
    ({ item }) => (
      <ChatBubble
        message={item}
        isMe={item.senderId === CURRENT_USER_ID}
        onLongPressUser={handleLongPressUser}
      />
    ),
    [handleLongPressUser],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          variant="text"
          iconOnly
          onPress={() => router.back()}
          wrapperStyle={styles.iconButton}
        >
          <BackIcon width={28} height={28} />
        </Button>
        <Text style={styles.headerTitle}>
          여의도 야간 러닝 ({PARTICIPANT_COUNT})
        </Text>
        <Button
          variant="text"
          iconOnly
          onPress={() => setMenuVisible(true)}
          wrapperStyle={styles.iconButton}
        >
          <MenuIcon width={28} height={28} />
        </Button>
      </View>

      <AnnouncementBar text={currentNotice} />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          inverted
          contentContainerStyle={styles.chatListContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={Platform.OS === "android"}
        />

        <View style={styles.inputContainer}>
          <Button
            variant="text"
            iconOnly
            onPress={handleAttachPress}
            wrapperStyle={styles.attachButton}
          >
            <AddIcon width={24} height={24} />
          </Button>

          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="메시지 보내기"
            placeholderTextColor={colors.gray400}
            multiline
            maxLength={500}
          />

          <Button
            variant="primary"
            iconOnly
            rounded
            disabled={!inputText.trim()}
            onPress={handleSend}
            wrapperStyle={styles.sendButton}
          >
            <SendIcon width={16} height={16} style={styles.sendIconFix} />
          </Button>
        </View>
      </KeyboardAvoidingView>

      <GroupOptionsMenu
        visible={isMenuVisible}
        isHost={isCurrentUserHost}
        onClose={() => setMenuVisible(false)}
        onLeave={() => {
          setMenuVisible(false);
          Alert.alert("나가기", "이 단체 채팅방에서 나가시겠습니까?");
        }}
        onRegisterNotice={() => {
          setMenuVisible(false);
          setTimeout(() => {
            setNoticeModalVisible(true);
          }, 300);
        }}
        onDeleteRoom={() => {
          setMenuVisible(false);
          Alert.alert(
            "채팅방 삭제",
            "정말 이 채팅방을 삭제하시겠습니까?\n모든 참여자와 대화 내용이 삭제됩니다.",
            [
              { text: "취소", style: "cancel" },
              {
                text: "삭제하기",
                style: "destructive",
                onPress: () => {
                  // TODO: [API] 호스트 권한으로 단체 채팅방 삭제
                  router.back();
                },
              },
            ],
          );
        }}
      />

      <NoticeModal
        visible={isNoticeModalVisible}
        onClose={() => setNoticeModalVisible(false)}
        onSubmit={handleRegisterNotice}
      />
    </SafeAreaView>
  );
}
