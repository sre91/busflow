import api from "./axios";

export interface ChatUser {
  _id: string;

  name: string;

  email: string;

  role?: "user" | "admin";
}

// Conversation

export interface Conversation {
  _id: string;

  participants: ChatUser[];

  createdAt: string;

  updatedAt: string;
}

// Chat message

export interface ChatMessage {
  _id: string;

  conversationId: string;

  senderId: string | ChatUser;

  content: string;

  read: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface MessagePagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

export interface PaginatedMessages {
  messages: ChatMessage[];

  pagination: MessagePagination;
}

// Create conversation

export const createConversation = async (
  userId: string,
  otherUserId: string,
): Promise<Conversation> => {
  const response = await api.post<{
    success: boolean;

    data: Conversation;
  }>("/chat/conversations", {
    userId,
    otherUserId,
  });

  return response.data.data;
};

export const getUserConversations = async (
  userId: string,
): Promise<Conversation[]> => {
  const response = await api.get<{
    success: boolean;

    data: Conversation[];
  }>(`/chat/conversations/user/${userId}`);

  return response.data.data;
};

// Get conversation messages

export const getConversationMessages = async (
  conversationId: string,
  page = 1,
  limit = 30,
): Promise<PaginatedMessages> => {
  const response = await api.get<{
    success: boolean;

    data: ChatMessage[];

    pagination: MessagePagination;
  }>(
    `/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
  );

  return {
    messages: response.data.data,

    pagination: response.data.pagination,
  };
};

// Send chat message

export const sendChatMessage = async (
  conversationId: string,
  senderId: string,
  content: string,
): Promise<ChatMessage> => {
  const response = await api.post<{
    success: boolean;

    data: ChatMessage;
  }>("/chat/messages", {
    conversationId,
    senderId,
    content,
  });

  return response.data.data;
};

export const markMessagesAsRead = async (
  conversationId: string,
  userId: string,
): Promise<number> => {
  const response = await api.patch<{
    success: boolean;

    data: {
      modifiedCount: number;
    };
  }>("/chat/messages/read", {
    conversationId,
    userId,
  });

  return response.data.data.modifiedCount;
};
