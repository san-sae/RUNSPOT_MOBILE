export type ChatTab = "GROUP" | "ONE_ON_ONE";
export type Role = "HOST" | "PARTICIPANT" | "SYSTEM";

export interface ChatRoom {
  id: string;
  type: ChatTab;
  title: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  memberCount?: number;
  hostName?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  avatarChar: string;
  isHost: boolean;
  content: string;
  time: string;
  type: "TEXT" | "SYSTEM";
}

export interface GroupMessage {
  id: string;
  senderId: string;
  senderName: string;
  avatarChar: string;
  role: Role;
  content: string;
  time: string;
}
