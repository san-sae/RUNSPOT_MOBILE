import { StyleSheet, Platform } from "react-native";

import { colors, fontSizes, fontWeights, spacing } from "@/src/constants";

export const chatStyles = StyleSheet.create({
  // 메인 컨테이너
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // 상단 헤더
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  iconButton: { padding: spacing.sm },
  backButton: { padding: spacing.xs },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  menuButton: { padding: spacing.xs },

  // 서브 헤더 (세션 정보 등)
  subHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.mainLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  subHeaderInfo: { gap: 4 },
  sessionTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: colors.gray900,
  },
  sessionStatus: {
    fontSize: fontSizes.sm,
    color: colors.gray600,
  },

  // 상단 공지사항
  announcementContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.mainLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  announcementIcon: { marginRight: spacing.sm },
  announcementText: {
    flex: 1,
    fontSize: fontSizes.sm,
    color: colors.gray800,
    fontWeight: fontWeights.medium,
  },

  // 채팅 목록 레이아웃
  keyboardAvoidingView: { flex: 1 },
  chatListContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },

  // 시스템 메시지
  systemMessageContainer: {
    alignItems: "center",
    marginVertical: spacing.md,
  },
  systemMessageBadge: {
    backgroundColor: colors.gray200,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 16,
  },
  systemMessageText: {
    fontSize: 12,
    color: colors.gray600,
    fontWeight: fontWeights.medium,
  },

  // 채팅 말풍선
  bubbleWrapper: { flexDirection: "row", marginBottom: spacing.sm },
  bubbleWrapperLeft: { justifyContent: "flex-start" },
  bubbleWrapperRight: { justifyContent: "flex-end" },

  // 사용자 프로필 아바타
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray300,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: colors.gray700,
  },

  // 채팅 메시지 내용 및 말풍선 스타일
  bubbleContent: { maxWidth: "75%" },
  bubbleContentRight: { alignItems: "flex-end" },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  senderName: {
    fontSize: fontSizes.sm,
    color: colors.gray700,
    fontWeight: fontWeights.medium,
  },

  messageRow: { flexDirection: "row", alignItems: "flex-end" },
  bubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: 16,
  },
  otherBubble: {
    backgroundColor: colors.gray100,
    borderTopLeftRadius: 4,
  },
  myBubble: {
    backgroundColor: colors.main,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: fontSizes.base,
    color: colors.text,
    lineHeight: 22,
  },
  myMessageText: { color: colors.white },

  // 메시지 전송 시간 표시
  timeTextLeft: {
    fontSize: 11,
    color: colors.gray400,
    marginLeft: spacing.xs,
    marginBottom: 2,
  },
  timeTextRight: {
    fontSize: 11,
    color: colors.gray400,
    marginRight: spacing.xs,
    marginBottom: 2,
  },

  // 하단 텍스트 입력창
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    backgroundColor: colors.bg,
  },
  attachButton: {
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 36,
    height: 36,
    marginBottom: Platform.OS === "ios" ? 10 : 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.gray100,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === "ios" ? 10 : 8,
    paddingBottom: Platform.OS === "ios" ? 10 : 8,
    minHeight: 40,
    maxHeight: 100,
    fontSize: fontSizes.base,
    color: colors.text,
    marginHorizontal: spacing.xs,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.main,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Platform.OS === "ios" ? 10 : 8,
    marginLeft: spacing.xs,
  },
  sendButtonDisabled: { backgroundColor: colors.gray300 },
  sendIconFix: { marginLeft: 2, marginTop: 2 },

  // 드롭다운 메뉴
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  dropdownMenu: {
    backgroundColor: colors.bg,
    borderRadius: 8,
    marginTop: 50,
    marginRight: spacing.md,
    width: 170,
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
    padding: spacing.md,
    gap: spacing.sm,
  },
  menuDivider: { height: 1, backgroundColor: colors.gray200 },
  menuText: { fontSize: fontSizes.base, color: colors.text },
});
