import { useState } from "react";
import type { SubmitEvent } from "react";
import ReactMarkdown from "react-markdown";

import {
  Armchair,
  Bot,
  CheckCircle2,
  Search,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import Button from "../ui/Button";

import {
  searchBusesWithAI,
  sendAIMessage,
  type AIBus,
  type ConversationMessage,
} from "../../api/aiApi";

function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm BusFlow AI. I can help you find buses, compare options, and plan your journey.",
    },
  ]);

  const [buses, setBuses] = useState<AIBus[]>([]);

  const [loading, setLoading] = useState(false);

  /*
   * Detect travel-related questions
   */

  const isBusSearchRequest = (text: string): boolean => {
    const keywords = [
      "bus",
      "buses",
      "travel",
      "go to",
      "from",
      "to",
      "route",
      "ticket",
      "ac sleeper",
      "ac seater",
      "non-ac",
    ];

    const lowerText = text.toLowerCase();

    return keywords.some((keyword) => lowerText.includes(keyword));
  };

  /*
   * Send message
   */

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    const userMessage: ConversationMessage = {
      role: "user",
      content: trimmedMessage,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);

    setMessage("");
    setLoading(true);

    try {
      /*
       * Bus search
       */

      if (isBusSearchRequest(trimmedMessage)) {
        const result = await searchBusesWithAI(trimmedMessage);

        setBuses(result.buses);

        const assistantMessage: ConversationMessage = {
          role: "assistant",
          content: result.recommendation,
        };

        setMessages((currentMessages) => [
          ...currentMessages,
          assistantMessage,
        ]);
      } else {
        /*
         * Normal AI conversation
         */

        const history = messages.filter(
          (item) => item.role === "user" || item.role === "assistant",
        );

        const aiResponse = await sendAIMessage(trimmedMessage, history);

        setMessages((currentMessages) => [
          ...currentMessages,
          {
            role: "assistant",
            content: aiResponse,
          },
        ]);
      }
    } catch (error) {
      console.error("AI request failed:", error);

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating AI button */}

      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="
            fixed
            bottom-5
            right-5
            z-50
            flex
            h-14
            w-14
            cursor-pointer
            items-center
            justify-center
            rounded-full
            bg-primary
            text-white
            shadow-xl
            ring-4
            ring-primary/10
            transition
            duration-200
            hover:scale-105
            hover:shadow-2xl
            active:scale-95
          "
          aria-label="Open BusFlow AI"
          title="BusFlow AI"
        >
          <Bot size={26} strokeWidth={2.2} />
        </button>
      )}

      {/* AI chat panel */}

      {isOpen && (
        <div
          className="
            fixed
            bottom-5
            right-5
            z-50
            flex
            h-[500px]
            w-[360px]
            max-w-[calc(100vw-2rem)]
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-2xl
          "
        >
          {/* Header */}

          <div className="flex shrink-0 items-center justify-between bg-primary px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <Sparkles size={19} />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold">BusFlow AI</h2>

                  <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-medium">
                    AI
                  </span>
                </div>

                <p className="mt-0.5 text-[11px] text-white/75">
                  Your smart travel assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="
                flex
                h-9
                w-9
                cursor-pointer
                items-center
                justify-center
                rounded-full
                transition
                hover:bg-white/15
                active:scale-95
              "
              aria-label="Close BusFlow AI"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-background p-3">
            {messages.map((chatMessage, index) => {
              const isUser = chatMessage.role === "user";

              return (
                <div
                  key={`${chatMessage.role}-${index}`}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bot size={13} />
                    </div>
                  )}

                  <div
                    className={`max-w-[84%] rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${
                      isUser
                        ? "rounded-br-md bg-primary text-white shadow-sm"
                        : "rounded-bl-md border border-slate-100 bg-white text-primary-dark shadow-sm"
                    }`}
                  >
                    {isUser ? (
                      <p>{chatMessage.content}</p>
                    ) : (
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="mb-2 text-sm font-bold text-primary-dark">
                              {children}
                            </h1>
                          ),

                          h2: ({ children }) => (
                            <h2 className="mb-2 text-sm font-bold text-primary-dark">
                              {children}
                            </h2>
                          ),

                          h3: ({ children }) => (
                            <h3 className="mb-1.5 text-xs font-bold text-primary-dark">
                              {children}
                            </h3>
                          ),

                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0">{children}</p>
                          ),

                          ul: ({ children }) => (
                            <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">
                              {children}
                            </ul>
                          ),

                          ol: ({ children }) => (
                            <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">
                              {children}
                            </ol>
                          ),

                          li: ({ children }) => <li>{children}</li>,

                          strong: ({ children }) => (
                            <strong className="font-semibold text-primary-dark">
                              {children}
                            </strong>
                          ),

                          em: ({ children }) => <em>{children}</em>,
                        }}
                      >
                        {chatMessage.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Bus recommendations */}

            {buses.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 px-1 text-xs font-semibold text-primary-dark">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Search size={13} />
                  </div>

                  <span>Recommended buses</span>
                </div>

                {buses.slice(0, 3).map((bus) => (
                  <div
                    key={bus._id}
                    className="
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      p-3
                      shadow-sm
                      transition
                      duration-200
                      hover:-translate-y-0.5
                      hover:shadow-md
                    "
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-primary-dark">
                          {bus.operator}
                        </p>

                        <p className="mt-1 text-[10px] text-muted">
                          {bus.busType}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-lg bg-primary/5 px-2 py-1">
                        <p className="text-sm font-bold text-primary">
                          ₹{bus.price}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-lg bg-slate-50 px-2.5 py-2">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-primary-dark">
                            {bus.departureTime}
                          </p>

                          <p className="mt-0.5 text-[10px] text-muted">
                            {bus.source}
                          </p>
                        </div>

                        <div className="mx-2 h-px flex-1 bg-slate-200" />

                        <div className="text-right">
                          <p className="font-semibold text-primary-dark">
                            {bus.arrivalTime}
                          </p>

                          <p className="mt-0.5 text-[10px] text-muted">
                            {bus.destination}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[10px] text-muted">
                      <span className="flex items-center gap-1">
                        <span>⭐</span>
                        {bus.rating}
                      </span>

                      <span className="flex items-center gap-1">
                        <Armchair size={12} />
                        {bus.availableSeats} seats
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Loading */}

            {loading && (
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot size={13} />
                </div>

                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-3 py-2.5 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/50" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/50 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/50 [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {/* Small trust message */}

            {!loading && messages.length === 1 && (
              <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-muted">
                <CheckCircle2 size={12} />
                <span>Ask me anything about your bus journey</span>
              </div>
            )}
          </div>

          {/* Input */}

          <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t border-slate-200 bg-white p-2.5"
          >
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ask about buses..."
                disabled={loading}
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-2
                  py-1.5
                  text-xs
                  outline-none
                  placeholder:text-slate-400
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />

              <Button type="submit" disabled={loading || !message.trim()}>
                <Send size={16} />
              </Button>
            </div>

            <p className="mt-1.5 text-center text-[9px] text-slate-400">
              BusFlow AI can help plan your journey
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default AIAssistant;
