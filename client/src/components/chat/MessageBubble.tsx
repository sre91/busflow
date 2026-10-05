import type { ChatMessage } from "../../api/chatApi";

interface MessageBubbleProps {
  message: ChatMessage;
  currentUserId: string;
}

function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
  const senderId =
    typeof message.senderId === "string"
      ? message.senderId
      : message.senderId._id;

  const isOwnMessage = senderId === currentUserId;

  const senderName =
    typeof message.senderId === "string" ? "" : message.senderId.name;

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isOwnMessage
            ? "rounded-br-md bg-primary text-white"
            : "rounded-bl-md bg-white text-primary-dark shadow-sm"
        }`}
      >
        {!isOwnMessage && senderName && (
          <p className="mb-1 text-xs font-semibold text-primary">
            {senderName}
          </p>
        )}

        <p className="text-sm leading-relaxed">{message.content}</p>

        <div
          className={`mt-1 text-[10px] ${
            isOwnMessage ? "text-white/70" : "text-muted"
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
