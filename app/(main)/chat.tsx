import { useRouter } from "expo-router";
import React, { useState, useCallback, useEffect, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ListRenderItem,
  Platform,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MOCK_CHAT_ROOMS } from "@/src/api/chat/chatApi.mock";
import SearchIcon from "@/src/assets/icon/chat/search.svg";
import CheckIcon from "@/src/assets/icon/manage-Participants/accept.svg";
import SettingsIcon from "@/src/assets/icon/my-page/setting.svg";
import { Button } from "@/src/components/common/button/Button";
import { colors, fontSizes, fontWeights, spacing } from "@/src/constants";
import { ChatRoom, ChatTab } from "@/src/types/api/chat";
import { AnalyticsHelper } from "@/src/utils/analytics";

type ChatListData = ArrayLike<ChatRoom> | null | undefined;

const ChatListItem = memo(
  ({ room, onPress }: { room: ChatRoom; onPress: (id: string) => void }) => {
    // 아바타 첫 글자 추출 (프로필 이미지가 없을 경우 대비)
    const avatarChar = room.title.charAt(0);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.roomContainer,
          pressed && styles.roomPressed,
        ]}
        onPress={() => onPress(room.id)}
      >
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{avatarChar}</Text>
        </View>

        <View style={styles.roomInfo}>
          <View style={styles.roomHeader}>
            <Text style={styles.roomTitle} numberOfLines={1}>
              {room.title}
              {room.type === "GROUP" && room.memberCount && (
                <Text style={styles.memberCount}> ({room.memberCount})</Text>
              )}
            </Text>
            <Text
              style={[
                styles.timeText,
                room.unreadCount > 0 && { color: colors.main },
              ]}
            >
              {room.lastMessageTime}
            </Text>
          </View>

          <View style={styles.roomFooter}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {room.lastMessage}
            </Text>
            {room.unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {room.unreadCount > 99 ? "99+" : room.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  },
);
ChatListItem.displayName = "ChatListItem";

export default function ChatScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ChatTab>("GROUP");

  const [sortType, setSortType] = useState<"LATEST" | "UNREAD">("LATEST");
  const [isSortMenuVisible, setSortMenuVisible] = useState(false);

  // [Analytics] 채팅방 목록 탭 전환 트래픽 기록
  useEffect(() => {
    AnalyticsHelper.logEvent("view_chat_list", { tab: activeTab }).catch(
      console.error,
    );
  }, [activeTab]);

  const filteredAndSortedRooms = React.useMemo(() => {
    const rooms = MOCK_CHAT_ROOMS.filter((room) => room.type === activeTab);

    if (sortType === "UNREAD") {
      rooms.sort((a, b) => b.unreadCount - a.unreadCount);
    }
    return rooms;
  }, [activeTab, sortType]);

  const handlePressRoom = useCallback(
    (roomId: string) => {
      // [Analytics] 채팅방 진입 트래픽 기록
      AnalyticsHelper.logEvent("enter_chat_room", {
        room_id: roomId,
        room_type: activeTab,
      });

      router.push({
        pathname:
          activeTab === "GROUP" ? "/chat/group/[id]" : "/chat/private/[id]",
        params: { id: roomId },
      });
    },
    [activeTab, router],
  );

  const renderItem: ListRenderItem<ChatRoom> = useCallback(
    ({ item }) => <ChatListItem room={item} onPress={handlePressRoom} />,
    [handlePressRoom],
  );

  const getItemLayout = useCallback(
    (_: ChatListData, index: number) => ({
      length: 76,
      offset: 76 * index,
      index,
    }),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>채팅</Text>
        <View style={styles.headerIcons}>
          <Button variant="text" iconOnly wrapperStyle={styles.iconButton}>
            <SearchIcon width={24} height={24} />
          </Button>
          <Button
            variant="text"
            iconOnly
            wrapperStyle={styles.iconButton}
            onPress={() => setSortMenuVisible(true)}
          >
            <SettingsIcon width={24} height={24} />
          </Button>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tabButton, activeTab === "GROUP" && styles.tabActive]}
          onPress={() => setActiveTab("GROUP")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "GROUP" && styles.tabTextActive,
            ]}
          >
            진행 중인 모임
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tabButton,
            activeTab === "ONE_ON_ONE" && styles.tabActive,
          ]}
          onPress={() => setActiveTab("ONE_ON_ONE")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "ONE_ON_ONE" && styles.tabTextActive,
            ]}
          >
            1:1 문의
          </Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.sortFilterText}>
          {sortType === "LATEST" ? "최신순" : "안 읽은 순"}
        </Text>
      </View>

      <FlatList
        data={filteredAndSortedRooms}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>참여 중인 채팅방이 없습니다.</Text>
          </View>
        }
      />
      <Modal visible={isSortMenuVisible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSortMenuVisible(false)}
        >
          <View style={styles.sortMenu}>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setSortType("LATEST");
                setSortMenuVisible(false);
              }}
            >
              <Text
                style={[
                  styles.menuText,
                  sortType === "LATEST" && {
                    color: colors.main,
                    fontWeight: "bold",
                  },
                ]}
              >
                최신순
              </Text>
              {sortType === "LATEST" && <CheckIcon width={18} height={18} />}
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setSortType("UNREAD");
                setSortMenuVisible(false);
              }}
            >
              <Text
                style={[
                  styles.menuText,
                  sortType === "UNREAD" && {
                    color: colors.main,
                    fontWeight: "bold",
                  },
                ]}
              >
                안 읽은 순
              </Text>
              {sortType === "UNREAD" && <CheckIcon width={18} height={18} />}
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: colors.bg,
  },
  headerTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 0,
  },
  iconButton: {
    padding: spacing.sm,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.main,
  },
  tabText: {
    fontSize: fontSizes.base,
    color: colors.gray400,
    fontWeight: fontWeights.medium,
  },
  tabTextActive: {
    color: colors.main,
    fontWeight: fontWeights.bold,
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg,
  },
  sortFilterText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: fontSizes.sm,
    color: colors.main,
    fontWeight: fontWeights.semibold,
  },

  listContent: {
    flexGrow: 1,
  },
  roomContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    height: 76,
    backgroundColor: colors.bg,
  },
  roomPressed: {
    backgroundColor: colors.bgSecondary,
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.gray200,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.gray600,
  },
  roomInfo: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.xs,
  },
  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomTitle: {
    flex: 1,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginRight: spacing.sm,
  },
  memberCount: {
    color: colors.gray500,
    fontWeight: fontWeights.medium,
  },
  timeText: {
    fontSize: fontSizes.xs,
    color: colors.gray400,
  },
  roomFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    flex: 1,
    fontSize: fontSizes.sm,
    color: colors.gray500,
    marginRight: spacing.md,
  },
  badge: {
    backgroundColor: colors.red,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: fontWeights.bold,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: {
    color: colors.gray400,
    fontSize: fontSizes.base,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  sortMenu: {
    backgroundColor: colors.bg,
    borderRadius: 8,
    marginTop: 135,
    marginRight: spacing.lg,
    width: 140,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: { elevation: 5 },
    }),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
  },
  menuDivider: { height: 1, backgroundColor: colors.gray200 },
  menuText: { fontSize: fontSizes.sm, color: colors.text },
});
