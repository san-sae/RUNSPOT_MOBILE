import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

import {
  acceptParticipant,
  rejectParticipant,
} from "@/src/api/manageParticipants/manageParticipants.index";
import {
  getNotificationsMockAPI,
  deleteNotificationMockAPI,
} from "@/src/api/notification/notificationApi.mock";
import { Button } from "@/src/components/common//button/Button";
import { colors, fontSizes, spacing } from "@/src/constants";
import { NOTIFICATION_ICON_MAP } from "@/src/constants/mappings";
import { NotificationItem } from "@/src/types/api/notification";

const notificationKeys = { list: () => ["notifications", "list"] };

export default function NotificationScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: notificationKeys.list(),
    queryFn: getNotificationsMockAPI,
  });

  const resolveNotificationStatus = (
    sessionId: number,
    participationId: number,
  ) => {
    queryClient.setQueryData(
      notificationKeys.list(),
      (old: NotificationItem[] | undefined) =>
        old
          ? old.map((item) =>
              item.relatedId === sessionId &&
              item.participationId === participationId
                ? { ...item, status: "RESOLVED" }
                : item,
            )
          : [],
    );
  };

  const resolveAllNotificationStatus = () => {
    queryClient.setQueryData(
      notificationKeys.list(),
      (old: NotificationItem[] | undefined) =>
        old ? old.map((item) => ({ ...item, isRead: true })) : [],
    );
  };

  const deleteMutation = useMutation({
    mutationFn: deleteNotificationMockAPI,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list() });
      const previousNotifications = queryClient.getQueryData(
        notificationKeys.list(),
      );

      queryClient.setQueryData(
        notificationKeys.list(),
        (old: NotificationItem[] | undefined) =>
          old ? old.filter((item) => item.id !== deletedId) : [],
      );

      return { previousNotifications };
    },
    onError: (err, deletedId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          notificationKeys.list(),
          context.previousNotifications,
        );
      }
      alert("알림 삭제에 실패했습니다.");
    },
  });

  const acceptMutation = useMutation({
    mutationFn: ({
      sessionId,
      participationId,
    }: {
      sessionId: number;
      participationId: number;
    }) => acceptParticipant(sessionId, participationId),
    onSuccess: (_, { sessionId, participationId }) => {
      Alert.alert("안내", "참여를 수락했습니다.");
      resolveNotificationStatus(sessionId, participationId);
    },
    onError: () => Alert.alert("오류", "수락 처리 중 오류가 발생했습니다."),
  });

  const rejectMutation = useMutation({
    mutationFn: ({
      sessionId,
      participationId,
    }: {
      sessionId: number;
      participationId: number;
    }) => rejectParticipant(sessionId, participationId),
    onSuccess: (_, { sessionId, participationId }) => {
      Alert.alert("오류", "참여를 거절했습니다.");
      resolveNotificationStatus(sessionId, participationId);
    },
    onError: () => Alert.alert("오류", "거절 처리 중 오류가 발생했습니다."),
  });

  const renderRightActions = (id: number) => (
    <Pressable
      style={styles.deleteAction}
      onPress={() => deleteMutation.mutate(id)}
    >
      <Ionicons name="trash-outline" size={24} color={colors.white} />
      <Text style={styles.deleteText}>삭제</Text>
    </Pressable>
  );

  const renderIcon = (type: string) => {
    const iconData =
      NOTIFICATION_ICON_MAP[type] || NOTIFICATION_ICON_MAP.CANCELED;
    return (
      <View style={[styles.iconCircle, { backgroundColor: colors.gray100 }]}>
        <Ionicons name={iconData.name} size={20} color={iconData.color} />
      </View>
    );
  };

  const handlePressNotification = (item: NotificationItem) => {
    queryClient.setQueryData(
      notificationKeys.list(),
      (old: NotificationItem[] | undefined) =>
        old
          ? old.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
          : [],
    );

    switch (item.type) {
      case "JOIN_REQUEST":
        if (item.relatedId) {
          router.push({
            pathname: "/manage-participants",
            params: { id: item.relatedId, title: item.title ?? "" },
          });
        }
        break;

      case "JOIN_ACCEPTED":
        if (item.relatedId) {
          router.push(`/chat/group/${item.relatedId}`);
        }
        break;

      case "JOIN_REJECTED":
      case "CANCELED":
        if (item.relatedId) {
          router.push({
            pathname: "/session-detail",
            params: { id: item.relatedId },
          });
        }
        break;

      case "GROUP_CHAT":
        if (item.relatedId) {
          router.push(`/chat/group/${item.relatedId}`);
        }
        break;

      case "ONE_ON_ONE_CHAT":
        if (item.relatedId) {
          router.push(`/chat/private/${item.relatedId}`);
        }
        break;

      case "RUNNING_FINISHED":
        if (item.relatedId) {
          router.push(`/host-rating?sessionId=${item.relatedId}`);
        }
        break;

      case "COMMENT":
        // TODO [라우팅]: 게시글 상세 화면으로 이동
        Alert.alert("알림", item.message);
        break;

      default:
        break;
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    return (
      <Swipeable
        renderRightActions={() => renderRightActions(item.id)}
        overshootRight={false}
      >
        <Pressable
          style={[styles.itemContainer, !item.isRead && styles.unreadItem]}
          onPress={() => handlePressNotification(item)}
        >
          <View style={styles.iconContainer}>{renderIcon(item.type)}</View>
          <View style={styles.contentContainer}>
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.timeText}>{item.timeText}</Text>

            {item.type === "JOIN_REQUEST" && item.status === "PENDING" && (
              <View style={styles.buttonRow}>
                <Button
                  variant="primary"
                  size="sm"
                  wrapperStyle={styles.actionButton}
                  disabled={
                    acceptMutation.isPending || rejectMutation.isPending
                  }
                  onPress={(e) => {
                    e.stopPropagation?.();
                    acceptMutation.mutate({
                      sessionId: item.relatedId!,
                      participationId: item.participationId!,
                    });
                  }}
                >
                  수락
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  wrapperStyle={styles.actionButton}
                  disabled={
                    acceptMutation.isPending || rejectMutation.isPending
                  }
                  onPress={(e) => {
                    e.stopPropagation?.();
                    rejectMutation.mutate({
                      sessionId: item.relatedId!,
                      participationId: item.participationId!,
                    });
                  }}
                >
                  거절
                </Button>
              </View>
            )}
          </View>
        </Pressable>
      </Swipeable>
    );
  };

  const renderFooter = () => {
    const hasUnread = notifications.some((item) => !item.isRead);

    if (notifications.length === 0 || !hasUnread) {
      return null;
    }

    return (
      <View style={styles.allReadButton}>
        <Button
          variant="text"
          onPress={resolveAllNotificationStatus}
          wrapperStyle={{ alignSelf: "flex-end" }}
        >
          모두 읽기
        </Button>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    );
  }

  const unreadNotifications = notifications.filter((item) => !item.isRead);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "알림", headerTitleAlign: "center" }} />
      <FlatList
        data={unreadNotifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { justifyContent: "center", alignItems: "center" },
  listContent: { paddingBottom: spacing.xxl },
  itemContainer: {
    flexDirection: "row",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.bg,
  },
  unreadItem: { backgroundColor: colors.mainLight },
  iconContainer: { marginRight: spacing.lg },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: { flex: 1, gap: spacing.xs },
  messageText: { fontSize: fontSizes.base, color: colors.text, lineHeight: 24 },
  timeText: { fontSize: fontSizes.sm, color: colors.textMuted, marginTop: 4 },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
    alignItems: "center",
  },
  actionButton: {
    minWidth: 80,
    paddingHorizontal: 16,
  },
  deleteAction: {
    backgroundColor: colors.error,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
  deleteText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    marginTop: 4,
  },
  allReadButton: {
    width: "100%",
    paddingVertical: spacing.md,
    paddingHorizontal: 20,
    alignItems: "flex-end",
  },
});
