import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useCallback } from "react";
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

import { MOCK_MESSAGES } from "@/src/api/chat/chatApi.mock";
import SendIcon from "@/src/assets/icon//chat/send.svg";
import BackIcon from "@/src/assets/icon/back.svg";
import MenuIcon from "@/src/assets/icon/chat/menu.svg";
import AddIcon from "@/src/assets/icon/chat/plus.svg";
import { ChatBubble } from "@/src/components/chat/ChatBubble";
import { PrivateOptionsMenu } from "@/src/components/chat/PrivateOptionsMenu";
import { chatStyles as styles } from "@/src/components/chat/styles/chat.styles";
import { Button } from "@/src/components/common/button/Button";
import { ReportModal } from "@/src/components/common/modal/ReportModal";
import { colors } from "@/src/constants";
import { useChatInput } from "@/src/hooks/chat/useChatInput";
import { Message } from "@/src/types/api/chat";
import { AnalyticsHelper } from "@/src/utils/analytics";

export default function PrivateChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isPending, setIsPending] = useState(true);

  const [isReportModalVisible, setReportModalVisible] = useState(false);
  const { inputText, setInputText, handleAttachPress } = useChatInput();

  const CURRENT_USER_ID = "me";

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: CURRENT_USER_ID,
      senderName: "러너김",
      avatarChar: "김",
      isHost: true,
      content: inputText.trim(),
      time: "방금",
      type: "TEXT",
    };

    setMessages((prev) => [newMessage, ...prev]);
    setInputText("");

    // [Analytics] 채팅 메시지 전송 트래픽 기록
    AnalyticsHelper.logEvent("send_chat_message", {
      chat_type: "ONE_ON_ONE",
      room_id: id || "unknown",
    });
  }, [inputText, id, setInputText]);

  const handleAcceptRunner = useCallback(() => {
    Alert.alert(
      "참여 수락",
      "이민지님의 참여를 수락하시겠습니까?\n수락 시 자동으로 단체 채팅방에 초대됩니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "수락하기",
          onPress: async () => {
            setIsPending(false);
            // [Analytics] 러닝 참여 수락 트래픽 기록
            await AnalyticsHelper.logEvent("accept_runner", {
              target_user: "이민지",
              room_id: id || "unknown",
            });

            Alert.alert("수락 완료", "단체 채팅방으로 이동합니다.", [
              {
                text: "확인",
                onPress: () => {
                  router.replace({
                    pathname: "/chat/group",
                    params: { id: "g1" },
                  });
                },
              },
            ]);
          },
        },
      ],
    );
  }, [id, router]);

  const handleReport = useCallback(() => {
    setMenuVisible(false);
    setTimeout(() => {
      setReportModalVisible(true);
    }, 300);
  }, []);

  const handleReportSubmit = useCallback((reason: string, details: string) => {
    // TODO: [API] 타겟 유저 신고 접수 전송
    // eslint-disable-next-line no-console
    console.log("신고 접수:", { target: "이민지", reason, details });

    // [Analytics] 유저 신고 접수 트래픽 기록
    AnalyticsHelper.logEvent("submit_report", {
      target: "이민지",
      reason,
    });

    setReportModalVisible(false);
    setTimeout(() => {
      Alert.alert(
        "신고 완료",
        "신고가 안전하게 접수되었습니다.\n검토 후 조치하겠습니다.",
      );
    }, 400);
  }, []);

  const renderItem: ListRenderItem<Message> = useCallback(
    ({ item }) => (
      <ChatBubble message={item} isMe={item.senderId === CURRENT_USER_ID} />
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          variant="text"
          iconOnly
          onPress={() => router.back()}
          wrapperStyle={styles.backButton}
        >
          <BackIcon width={24} height={24} />
        </Button>
        <Text style={styles.headerTitle}>이민지</Text>
        <Button
          variant="text"
          iconOnly
          onPress={() => setMenuVisible(true)}
          wrapperStyle={styles.menuButton}
        >
          <MenuIcon width={24} height={24} />
        </Button>
      </View>

      <View style={styles.subHeader}>
        <View style={styles.subHeaderInfo}>
          <Text style={styles.sessionTitle}>여의도 야간 러닝</Text>
          <Text style={styles.sessionStatus}>
            {isPending ? "참여 대기 중" : "참여 확정"}
          </Text>
        </View>
        {isPending && (
          <Button variant="primary" size="sm" onPress={handleAcceptRunner}>
            수락하기
          </Button>
        )}
      </View>

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

      <PrivateOptionsMenu
        visible={isMenuVisible}
        onClose={() => setMenuVisible(false)}
        onLeave={() => {
          setMenuVisible(false);
          Alert.alert("나가기", "채팅방에서 나가시겠습니까?");
        }}
        onReport={handleReport}
      />

      <ReportModal
        visible={isReportModalVisible}
        onClose={() => setReportModalVisible(false)}
        onSubmit={handleReportSubmit}
        targetName="이민지"
      />
    </SafeAreaView>
  );
}
