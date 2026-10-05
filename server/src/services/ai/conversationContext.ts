export type ConversationRole = "user" | "assistant";

export interface ConversationMessage {
  role: ConversationRole;
  content: string;
}

export interface ConversationContext {
  messages: ConversationMessage[];
}
