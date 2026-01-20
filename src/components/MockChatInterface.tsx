import { useState, useEffect, useRef } from "react";
import { TypedText } from "./TypedText";
import { ArrowUp, HelpCircle } from "lucide-react";

interface MockChatInterfaceProps {
  query: string;
  onComplete: () => void;
}

type Phase = "idle" | "moving-mouse" | "clicking" | "typing" | "submitting" | "redirecting";

export const MockChatInterface = ({ query, onComplete }: MockChatInterfaceProps) => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [showSarcasm, setShowSarcasm] = useState(false);
  const [sendClicked, setSendClicked] = useState(false);
  const didCompleteRef = useRef(false);
  const cursorClasses =
    phase === "moving-mouse"
      ? "opacity-100 translate-x-6 translate-y-6"
      : phase === "clicking"
        ? "opacity-100 translate-x-24 translate-y-6 scale-95"
        : phase === "typing" || phase === "submitting" || phase === "redirecting"
          ? "opacity-0 translate-x-24 translate-y-6"
          : "opacity-0 -translate-x-6 -translate-y-6";

  useEffect(() => {
    if (!sendClicked) return;
    const timer = setTimeout(() => setSendClicked(false), 180);
    return () => clearTimeout(timer);
  }, [sendClicked]);

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
    if (phase === "typing") {
      const maxTypingMs = Math.max(2000, query.length * 220);
      const timer = setTimeout(() => {
        if (!didCompleteRef.current) {
          handleTypingComplete();
        }
      }, maxTypingMs);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "redirecting") {
      const timer = setTimeout(() => {
        const target = new URL("https://chat.com/");
        target.searchParams.set("q", query);
        window.location.assign(target.toString());
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, query]);

  const handleTypingComplete = () => {
    if (didCompleteRef.current) return;
    didCompleteRef.current = true;
    setPhase("submitting");
    setSendClicked(true);
    setTimeout(() => {
      setShowSarcasm(true);
      setTimeout(() => {
        setPhase("redirecting");
      }, 2000);
    }, 500);
  };

  return (
    <div className="min-h-screen chat-container chat-container-flat flex flex-col bg-background text-foreground light">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="w-7 h-7 rounded-full flex items-center justify-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/ChatGPT-Logo.svg/960px-ChatGPT-Logo.svg.png"
              alt="ChatGPT logo"
              className="w-4 h-4"
            />
          </div>
          <span>ChatGPT</span>
          <span className="text-xs text-muted-foreground">▼</span>
        </div>
        <nav className="hidden md:flex items-center gap-5 text-xs text-muted-foreground">
          <span className="hover:text-foreground transition-colors">About</span>
          <span className="hover:text-foreground transition-colors">Features</span>
          <span className="hover:text-foreground transition-colors">Learn</span>
          <span className="hover:text-foreground transition-colors">Business</span>
          <span className="hover:text-foreground transition-colors">Pricing</span>
          <span className="hover:text-foreground transition-colors">Images</span>
          <span className="hover:text-foreground transition-colors">Download</span>
        </nav>
        <div className="flex items-center gap-2 text-xs">
          <button className="px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors">
            Log in
          </button>
          <button className="px-3 py-1.5 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity">
            Sign up for free
          </button>
          <button
            aria-label="Help"
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-6">
            What’s on the agenda today?
          </h1>
          <div className="relative w-[min(760px,90vw)] mx-auto">
            <div
              className={`pointer-events-none absolute left-2 top-2 z-20 transition-all duration-700 ease-out ${cursorClasses}`}
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))" }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-foreground" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M4.2 2.5c-.6-.3-1.3.2-1.1.9l5.2 18.2c.2.7 1.1.8 1.5.2l3-4.7 5.4 4.6c.4.3 1 .2 1.2-.2l2-3.4c.2-.4.1-1-.3-1.2l-6.6-3.1 2.6-4.2c.4-.6 0-1.4-.7-1.5L4.2 2.5z"
                />
              </svg>
            </div>
            <div
              className={`relative bg-card border rounded-2xl shadow-sm transition-all ${
                phase === "clicking" || phase === "typing" || phase === "submitting"
                  ? "border-foreground/30 ring-1 ring-foreground/10"
                  : "border-border"
              }`}
            >
              <div className="flex items-center px-4 py-3">
                <div className="flex-1 text-sm md:text-base min-h-[24px] text-left">
                  {phase === "typing" ? (
                    <TypedText
                      text={query}
                      speed={100}
                      onComplete={handleTypingComplete}
                      showCursor={false}
                      className="text-foreground"
                    />
                  ) : phase === "submitting" || phase === "redirecting" ? (
                    <span className="text-foreground">{query}</span>
                  ) : (
                    <span className="text-muted-foreground">Ask anything</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between px-3 pb-3">
                <button
                  aria-label="Add photos"
                  className="flex items-center justify-center h-9 w-9 rounded-full border border-border text-muted-foreground hover:bg-muted transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" aria-label="" className="icon">
                    <use href="/cdn/assets/sprites-core-k5zux585.svg#712359" fill="currentColor" />
                  </svg>
                </button>
                <button
                  aria-label={
                    phase === "typing" || phase === "submitting" || phase === "redirecting"
                      ? "Submit prompt"
                      : "Start voice mode"
                  }
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-150 ${
                    phase === "typing" || phase === "submitting" || phase === "redirecting"
                      ? "bg-foreground text-background"
                      : "bg-muted text-foreground hover:opacity-80"
                  } ${sendClicked ? "scale-95" : ""}`}
                >
                  <div className="flex items-center justify-center">
                    {phase === "typing" || phase === "submitting" || phase === "redirecting" ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" aria-hidden="true" className="icon">
                        <use href="/cdn/assets/sprites-core-k5zux585.svg#ac37b7" fill="currentColor" />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
          {showSarcasm && (
            <p className="text-xs text-muted-foreground mt-4">
              Redirecting you to the answer you could’ve found yourself…
            </p>
          )}
        </div>
      </div>

      <footer className="pb-6 text-center text-[10px] text-muted-foreground">
        By messaging ChatGPT, you agree to our Terms and have read our Privacy Policy.
      </footer>
    </div>
  );
};
