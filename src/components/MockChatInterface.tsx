import { useState, useEffect } from "react";
import { TypedText } from "./TypedText";
import { ArrowUp, Sparkles } from "lucide-react";

interface MockChatInterfaceProps {
  query: string;
  onComplete: () => void;
}

type Phase = "idle" | "moving-mouse" | "clicking" | "typing" | "submitting" | "redirecting";

export const MockChatInterface = ({ query, onComplete }: MockChatInterfaceProps) => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [showSarcasm, setShowSarcasm] = useState(false);

  useEffect(() => {
    // Start the animation sequence
    const timer = setTimeout(() => setPhase("moving-mouse"), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === "moving-mouse") {
      const timer = setTimeout(() => setPhase("clicking"), 800);
      return () => clearTimeout(timer);
    }
    if (phase === "clicking") {
      const timer = setTimeout(() => setPhase("typing"), 400);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleTypingComplete = () => {
    setPhase("submitting");
    setTimeout(() => {
      setShowSarcasm(true);
      setTimeout(() => {
        setPhase("redirecting");
        setTimeout(() => {
          // Redirect to ChatGPT with the query
          window.location.href = `https://chat.openai.com/?q=${encodeURIComponent(query)}`;
        }, 1500);
      }, 2000);
    }, 500);
  };

  return (
    <div className="min-h-screen chat-container flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="text-foreground font-medium">ChatGPT</span>
        </div>
        <div className="text-xs text-muted-foreground">
          (A demonstration for the uninitiated)
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {showSarcasm && (
          <div className="fade-in-up text-center mb-8">
            <p className="text-2xl font-medium text-foreground mb-2">
              Was that so hard? 🙄
            </p>
            <p className="text-muted-foreground">
              Redirecting you to the answer you could've found yourself...
            </p>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 pb-8">
        <div className="w-full max-w-3xl mx-auto">
          <div 
            className={`relative flex items-center bg-card border rounded-2xl px-4 py-3 shadow-lg transition-all ${
              phase === "clicking" || phase === "typing" || phase === "submitting" 
                ? "border-primary/50 ring-1 ring-primary/20" 
                : "border-border"
            }`}
          >
            <div className="flex-1 text-base min-h-[24px]">
              {phase === "typing" ? (
                <TypedText 
                  text={query} 
                  speed={100} 
                  onComplete={handleTypingComplete}
                  className="text-foreground"
                />
              ) : phase === "submitting" || phase === "redirecting" ? (
                <span className="text-foreground">{query}</span>
              ) : (
                <span className="text-muted-foreground">Ask anything...</span>
              )}
            </div>
            <button
              className={`ml-3 p-2 rounded-lg transition-colors ${
                phase === "submitting" || phase === "redirecting"
                  ? "bg-primary text-primary-foreground animate-pulse-subtle"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
          
          {/* Fake cursor indicator */}
          {(phase === "moving-mouse" || phase === "clicking") && (
            <div 
              className="absolute pointer-events-none transition-all duration-500"
              style={{
                left: phase === "clicking" ? "50%" : "70%",
                bottom: phase === "clicking" ? "80px" : "200px",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
                <path 
                  d="M5.5 3.21V20.79c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.85a.5.5 0 0 0-.85.36Z" 
                  fill="white" 
                  stroke="black" 
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          )}
        </div>
        
        <p className="text-center text-xs text-muted-foreground mt-4">
          letmechatgptthat.com • For all those "quick questions"
        </p>
      </div>
    </div>
  );
};
