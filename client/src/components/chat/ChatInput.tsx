import { useState } from "react";

import { Send } from "lucide-react";

import Button from "../ui/Button";

interface ChatInputProps {
  onSend: (message: string) => void;

  disabled?: boolean;
}

function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled) {
      return;
    }

    onSend(trimmedMessage);

    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-slate-200 bg-white p-3"
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Type a message..."
          disabled={disabled}
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-slate-50"
        />

        <Button type="submit" disabled={disabled || !message.trim()}>
          <Send size={18} />
        </Button>
      </div>
    </form>
  );
}

export default ChatInput;
