export type NotificationType =
  | "JOIN_REQUEST" // 참여 신청
  | "JOIN_ACCEPTED" // 참여 수락
  | "JOIN_REJECTED" // 참여 거절
  | "REMINDER" // 30분 전 알림
  | "GROUP_CHAT" // 단체 채팅방 새 메시지
  | "ONE_ON_ONE_CHAT" // 1:1 대화 메시지
  | "COMMENT" // 내 게시글 댓글
  | "CANCELED" // 모임 취소
  | "RUNNING_FINISHED"; // 러닝 종료

export type NotificationStatus = "PENDING" | "RESOLVED";

export interface NotificationItem {
  id: number;
  type: NotificationType;
  message: string;
  timeText: string;
  isRead: boolean;
  relatedId?: number;
  participationId?: number;
  status?: NotificationStatus;
  senderName?: string;
  senderProfile?: string;
  title?: string;
}
