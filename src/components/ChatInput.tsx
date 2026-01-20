import { useState } from "react";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSubmit: (query: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = ({ onSubmit, disabled, placeholder = "Ask anything..." }: ChatInputProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !disabled) {
      onSubmit(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-center bg-card border border-border rounded-2xl px-4 py-3 shadow-lg transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-base outline-none disabled:opacity-50"
          autoFocus
        />
        <button
          type="submit"
          disabled={!query.trim() || disabled}
          className="ml-3 p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
