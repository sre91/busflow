import { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle, Wifi, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import socket from "../socket";

import {
  getConversationMessages,
  getUserConversations,
  type ChatMessage,
  type Conversation,
} from "../api/chatApi";

import ChatWindow from "../components/chat/ChatWindow";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

import { useAppSelector } from "../app/hooks";

function ChatPage() {
  const user = useAppSelector((state) => state.auth.user);

  const currentUserId = user?.id || "";

  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [loading, setLoading] = useState(true);

  const [messagesLoading, setMessagesLoading] = useState(false);

  const [error, setError] = useState("");

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", handleConnect);

    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);

      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  useEffect(() => {
    const loadConversations = async () => {
      if (!currentUserId) {
        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getUserConversations(currentUserId);

        setConversations(data);
      } catch (error) {
        console.error("Failed to load conversations:", error);

        setError("Unable to load conversations.");
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [currentUserId]);

  useEffect(() => {
    const handleReceiveMessage = (message: ChatMessage) => {
      if (
        !selectedConversation ||
        message.conversationId !== selectedConversation._id
      ) {
        return;
      }

      setMessages((currentMessages) => {
        const alreadyExists = currentMessages.some(
          (item) => item._id === message._id,
        );

        if (alreadyExists) {
          return currentMessages;
        }

        return [...currentMessages, message];
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [selectedConversation]);

  const handleSelectConversation = async (conversation: Conversation) => {
    if (!currentUserId) {
      return;
    }

    try {
      setMessagesLoading(true);

      setError("");

      if (
        selectedConversation &&
        selectedConversation._id !== conversation._id
      ) {
        socket.emit("leaveChat", selectedConversation._id);
      }

      setSelectedConversation(conversation);

      setMessages([]);

      const result = await getConversationMessages(conversation._id, 1, 30);

      setMessages(result.messages);

      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("joinChat", {
        conversationId: conversation._id,

        userId: currentUserId,
      });

      socket.emit("markMessagesAsRead", {
        conversationId: conversation._id,

        userId: currentUserId,
      });
    } catch (error) {
      console.error("Failed to open conversation:", error);

      setError("Unable to open conversation.");
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversation || !currentUserId || !socket.connected) {
      return;
    }

    socket.emit("sendMessage", {
      conversationId: selectedConversation._id,

      senderId: currentUserId,

      content,
    });
  };

  const handleBack = () => {
    if (selectedConversation) {
      socket.emit("leaveChat", selectedConversation._id);
    }

    setSelectedConversation(null);

    setMessages([]);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto max-w-7xl px-6 py-10 md:py-12">
          <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm md:p-7">
            <div className="animate-pulse">
              <div className="h-7 w-32 rounded-lg bg-slate-200" />

              <div className="mt-3 h-4 w-64 rounded bg-slate-200" />
            </div>
          </div>

          <div className="mt-8 grid h-[650px] gap-5 lg:grid-cols-[320px_1fr]">
            <Card className="border border-slate-200 p-0 shadow-sm">
              <div className="animate-pulse">
                <div className="border-b border-slate-200 p-5">
                  <div className="h-5 w-32 rounded bg-slate-200" />
                </div>

                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 border-b border-slate-100 p-5"
                  >
                    <div className="h-10 w-10 rounded-full bg-slate-200" />

                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 rounded bg-slate-200" />
                      <div className="h-3 w-24 rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="hidden lg:block">
              <div className="flex h-full animate-pulse items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-slate-200" />
              </div>
            </Card>
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6">
          <Card className="w-full max-w-md border border-slate-200 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageCircle size={30} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-primary-dark">
              Login required
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-muted">
              Please log in to use BusFlow chat.
            </p>

            <div className="mt-6">
              <Button onClick={() => navigate("/login")}>
                Login to Continue
              </Button>
            </div>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-12">
        {/* Page header */}

        <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm md:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageCircle size={24} />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary-dark">
                  Messages
                </h1>

                <p className="mt-1 text-sm text-muted md:text-base">
                  Chat with BusFlow users and support.
                </p>
              </div>
            </div>

            {/* Connection status */}

            <div
              className={`flex w-fit items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
                isConnected
                  ? "bg-success/10 text-success"
                  : "bg-slate-100 text-muted"
              }`}
            >
              {isConnected ? (
                <>
                  <Wifi size={14} />
                  Connected
                </>
              ) : (
                <>
                  <WifiOff size={14} />
                  Reconnecting
                </>
              )}
            </div>
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{error}</span>
          </div>
        )}

        {/* Chat layout */}

        <div className="mt-6 grid h-[650px] gap-5 lg:grid-cols-[320px_1fr]">
          {/* Conversation list */}

          <div
            className={`overflow-hidden rounded-2xl border border-slate-200 bg-surface shadow-sm ${
              selectedConversation ? "hidden lg:block" : "block"
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-bold text-primary-dark">Conversations</h2>

                <p className="mt-0.5 text-xs text-muted">
                  {conversations.length}{" "}
                  {conversations.length === 1
                    ? "conversation"
                    : "conversations"}
                </p>
              </div>

              <MessageCircle size={18} className="text-primary" />
            </div>

            <div className="h-[calc(650px-73px)] overflow-y-auto">
              {conversations.length === 0 && (
                <div className="flex h-full items-center justify-center p-6 text-center">
                  <div>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <MessageCircle size={25} />
                    </div>

                    <h3 className="mt-4 font-bold text-primary-dark">
                      No conversations yet
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      Your conversations will appear here.
                    </p>
                  </div>
                </div>
              )}

              {conversations.map((conversation) => {
                const otherUser = conversation.participants.find(
                  (participant) => participant._id !== currentUserId,
                );

                const isSelected =
                  selectedConversation?._id === conversation._id;

                return (
                  <button
                    type="button"
                    key={conversation._id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`w-full cursor-pointer border-b border-slate-100 px-5 py-4 text-left transition ${
                      isSelected ? "bg-primary/5" : "hover:bg-background"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}

                      <div
                        className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-semibold ${
                          isSelected
                            ? "bg-primary text-white"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {otherUser?.name?.charAt(0).toUpperCase() || "?"}

                        {isSelected && (
                          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-success text-white">
                            <CheckCircle2 size={10} />
                          </span>
                        )}
                      </div>

                      {/* User information */}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={`truncate font-semibold ${
                              isSelected ? "text-primary" : "text-primary-dark"
                            }`}
                          >
                            {otherUser?.name || "Conversation"}
                          </p>
                        </div>

                        <p className="mt-1 truncate text-xs text-muted">
                          {otherUser?.email || "BusFlow user"}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat window */}

          <div
            className={`min-h-0 ${
              selectedConversation ? "block" : "hidden lg:block"
            }`}
          >
            {selectedConversation ? (
              (() => {
                const otherUser =
                  selectedConversation.participants.find(
                    (participant) => participant._id !== currentUserId,
                  ) || null;

                return (
                  <ChatWindow
                    currentUserId={currentUserId}
                    otherUser={otherUser}
                    messages={messages}
                    isConnected={isConnected}
                    onSendMessage={handleSendMessage}
                    onBack={handleBack}
                  />
                );
              })()
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-slate-200 bg-surface shadow-sm">
                <div className="px-6 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <MessageCircle size={30} />
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-primary-dark">
                    Select a conversation
                  </h2>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
                    Choose a conversation from the list to start chatting.
                  </p>

                  <div className="mt-5 flex items-center justify-center gap-2 text-xs text-success">
                    <CheckCircle2 size={14} />
                    Real-time messaging enabled
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages loading */}

        {messagesLoading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Loading messages...
          </div>
        )}
      </section>
    </main>
  );
}

export default ChatPage;
