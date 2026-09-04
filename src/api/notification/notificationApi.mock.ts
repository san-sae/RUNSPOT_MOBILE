import { NotificationItem } from "@/src/types/api/notification";

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: "JOIN_REQUEST",
    senderName: "이민지",
    message: "이민지 님이 여의도 야간 러닝에 참여를 신청했습니다.",
    timeText: "2분 전",
    isRead: false,
    relatedId: 101,
    participationId: 501,
    status: "PENDING",
    title: "여의도 야간 러닝",
  },
  {
    id: 2,
    type: "ONE_ON_ONE_CHAT",
    senderName: "박서준",
    message: "박서준님이 메시지를 보냈습니다: 짐 보관 장소가 어딘가요?",
    timeText: "10분 전",
    isRead: false,
  },
  {
    id: 3,
    type: "REMINDER",
    message:
      "호스팅하신 [여의도 야간 러닝] 시작 30분 전입니다. 러닝을 준비해 주세요.",
    timeText: "방금",
    isRead: false,
    relatedId: 101,
  },
  {
    id: 4,
    type: "GROUP_CHAT",
    message: "여의도 야간 러닝 단체 채팅방에 새 메시지가 있습니다.",
    timeText: "1시간 전",
    isRead: true,
    relatedId: 201,
  },
  {
    id: 5,
    type: "JOIN_ACCEPTED",
    message:
      "[여의도 야간 러닝] 참여가 수락되었습니다. 단체 채팅방을 확인해 보세요.",
    timeText: "방금",
    isRead: false,
    relatedId: 101,
  },
  {
    id: 6,
    type: "COMMENT",
    senderName: "운동왕",
    message: "내 러닝 코스 게시글에 운동왕님이 댓글을 남겼습니다.",
    timeText: "1시간 전",
    isRead: false,
  },
  {
    id: 7,
    type: "CANCELED",
    message: "[주말 10K 챌린지] 모임 정원이 마감되어 참여가 취소되었습니다.",
    timeText: "어제",
    isRead: false,
  },
  {
    id: 8,
    type: "JOIN_REJECTED",
    message: "[여의도 야간 러닝] 참여가 거절되었습니다.",
    timeText: "어제",
    isRead: false,
    relatedId: 101,
  },
  {
    id: 9,
    type: "ONE_ON_ONE_CHAT",
    senderName: "김민수",
    message: "김민수님이 메시지를 보냈습니다: 내일 집합 장소 여쭤봅니다!",
    timeText: "어제",
    isRead: false,
    relatedId: 301,
  },
  {
    id: 10,
    type: "RUNNING_FINISHED",
    message:
      "[여의도 야간 러닝] 모임이 종료되었습니다. 함께 뛴 멤버들에 대한 평가를 남겨주세요.",
    timeText: "2일 전",
    isRead: false,
    relatedId: 101,
  },
];

export const getNotificationsMockAPI = async (): Promise<
  NotificationItem[]
> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_NOTIFICATIONS), 800),
  );
};

export const deleteNotificationMockAPI = async (_id: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, 500));
};
