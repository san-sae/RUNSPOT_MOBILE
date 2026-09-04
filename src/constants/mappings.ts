import { Ionicons } from "@expo/vector-icons";

import { colors } from "./theme";

export const GENDER_MAP: Record<string, string> = {
  MALE: "남성",
  FEMALE: "여성",
};

export const getGenderColor = (gender: string) => {
  return gender === "MALE" ? colors.main : colors.red600;
};

export const AGEGROUPMAP: Record<string, string> = {
  "10S": "10대",
  "20S": "20대",
  "30S": "30대",
  "40S": "40대",
  "50S": "50대",
};

export const NOTIFICATION_ICON_MAP: Record<
  string,
  { name: keyof typeof Ionicons.glyphMap; color: string; bg: string }
> = {
  JOIN_REQUEST: { name: "person", color: colors.gray500, bg: colors.gray200 },
  JOIN_ACCEPTED: { name: "checkmark", color: colors.white, bg: colors.main },
  JOIN_REJECTED: { name: "close", color: colors.gray500, bg: colors.gray200 },
  REMINDER: {
    name: "notifications-outline",
    color: colors.main,
    bg: colors.mainLight,
  },
  RUNNING_FINISHED: {
    name: "flag-outline",
    color: colors.main,
    bg: colors.mainLight,
  },
  GROUP_CHAT: {
    name: "chatbubble-outline",
    color: colors.main,
    bg: colors.gray100,
  },
  ONE_ON_ONE_CHAT: {
    name: "chatbubble-outline",
    color: colors.main,
    bg: colors.gray100,
  },
  INQUIRY: {
    name: "chatbubble-outline",
    color: colors.main,
    bg: colors.gray100,
  },
  COMMENT: {
    name: "chatbubble-outline",
    color: colors.main,
    bg: colors.gray100,
  },
  CANCELED: { name: "information", color: colors.gray500, bg: colors.gray100 },
};
