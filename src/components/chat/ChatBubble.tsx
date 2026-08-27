import { memo } from "react";
import { View, Text, Pressable } from "react-native";

import { chatStyles as styles } from "./styles/chat.styles";

import Chip from "@/src/components/common/chip";
import { Message, GroupMessage } from "@/src/types/api/chat";

interface ChatBubbleProps {
  message: Message | GroupMessage;
  isMe: boolean;
  onLongPressUser?: (user: GroupMessage) => void;
}

export const ChatBubble = memo(
  ({ message, isMe, onLongPressUser }: ChatBubbleProps) => {
    const isSystem =
      ("type" in message && message.type === "SYSTEM") ||
      ("role" in message && message.role === "SYSTEM");

    const isHost =
      ("isHost" in message && message.isHost) ||
      ("role" in message && message.role === "HOST");

    if (isSystem) {
      return (
        <View style={styles.systemMessageContainer}>
          <View style={styles.systemMessageBadge}>
            <Text style={styles.systemMessageText}>{message.content}</Text>
          </View>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.bubbleWrapper,
          isMe ? styles.bubbleWrapperRight : styles.bubbleWrapperLeft,
        ]}
      >
        {!isMe && (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{message.avatarChar}</Text>
          </View>
        )}
        <View style={[styles.bubbleContent, isMe && styles.bubbleContentRight]}>
          {!isMe && (
            <View style={styles.nameRow}>
              <Text style={styles.senderName}>{message.senderName}</Text>
              {isHost && (
                <Chip
                  label="호스트"
                  size="small"
                  color="primary"
                  variant="filled"
                />
              )}
            </View>
          )}
          <View style={styles.messageRow}>
            {isMe && <Text style={styles.timeTextRight}>{message.time}</Text>}

            <Pressable
              style={[
                styles.bubble,
                isMe ? styles.myBubble : styles.otherBubble,
              ]}
              onLongPress={() => {
                if (!isMe && onLongPressUser && "role" in message) {
                  onLongPressUser(message);
                }
              }}
              delayLongPress={300}
              disabled={!onLongPressUser || isMe}
            >
              <Text style={[styles.messageText, isMe && styles.myMessageText]}>
                {message.content}
              </Text>
            </Pressable>

            {!isMe && <Text style={styles.timeTextLeft}>{message.time}</Text>}
          </View>
        </View>
      </View>
    );
  },
);

ChatBubble.displayName = "ChatBubble";
