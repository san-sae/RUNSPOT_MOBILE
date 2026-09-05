import { Router } from "expo-router";
import { Alert } from "react-native";

export interface NotificationRoutePayload {
  type: string;
  relatedId?: string | number | null;
  title?: string;
  message?: string;
}

export const parseString = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

export const parseId = (value: unknown): string | number | undefined =>
  typeof value === "string" || typeof value === "number" ? value : undefined;

/**
 * 알림 타입에 따라 적절한 화면으로 라우팅을 처리하는 공통 유틸리티 함수
 * @param payload 알림 데이터 (푸시 알림 페이로드 또는 인앱 알림 아이템)
 * @param router Expo Router 인스턴스 (useRouter()의 반환값)
 */
export const handleNotificationRouting = (
  payload: NotificationRoutePayload,
  router: Router,
) => {
  const { type, title, message } = payload;

  const relatedId = payload.relatedId ? String(payload.relatedId) : null;

  if (!relatedId && type !== "COMMENT" && type !== "INQUIRY") return;

  switch (type) {
    case "JOIN_REQUEST":
      router.push({
        pathname: "/manage-participants",
        params: { id: relatedId, title: title ?? "" },
      });
      break;

    case "JOIN_ACCEPTED":
    case "GROUP_CHAT":
      router.push(`/chat/group/${relatedId}`);
      break;

    case "JOIN_REJECTED":
    case "CANCELED":
      router.push({
        pathname: "/session-detail",
        params: { id: relatedId },
      });
      break;

    case "ONE_ON_ONE_CHAT":
      router.push(`/chat/private/${relatedId}`);
      break;

    case "RUNNING_FINISHED":
      router.push(`/host-rating?sessionId=${relatedId}`);
      break;

    case "COMMENT":
      // TODO [라우팅]: 게시글 상세 화면으로 이동
      Alert.alert("알림", message);
      break;

    default:
      break;
  }
};
