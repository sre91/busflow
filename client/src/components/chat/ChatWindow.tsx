import { useEffect, useRef } from "react";

import { ArrowLeft, Bot, Circle } from "lucide-react";

import type { ChatMessage, ChatUser } from "../../api/chatApi";

import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

interface ChatWindowProps {
  currentUserId: string;
  otherUser: ChatUser | null;

  messages: ChatMessage[];

  isConnected: boolean;

  onSendMessage: (message: string) => void;

  onBack?: () => void;
}

function ChatWindow({
  currentUserId,
  otherUser,
  messages,
  isConnected,
  onSendMessage,
  onBack,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-background shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg p-2 transition hover:bg-slate-100"
              aria-label="Back to conversations"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            {otherUser ? (
              otherUser.name.charAt(0).toUpperCase()
            ) : (
              <Bot size={20} />
            )}
          </div>

          <div className="min-w-0">
            <h2 className="truncate font-bold text-primary-dark">
              {otherUser?.name || "BusFlow Chat"}
            </h2>

            <div className="mt-1 flex items-center gap-1.5 text-xs">
              <Circle
                size={8}
                className={
                  isConnected
                    ? "fill-success text-success"
                    : "fill-red-500 text-red-500"
                }
              />

              <span className="text-muted">
                {isConnected ? "Live" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot size={26} />
              </div>

              <p className="mt-4 font-semibold text-primary-dark">
                Start the conversation
              </p>

              <p className="mt-1 text-sm text-muted">
                Send a message to begin chatting.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            currentUserId={currentUserId}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}

      <ChatInput onSend={onSendMessage} disabled={!isConnected} />
    </div>
  );
}

export default ChatWindow;
