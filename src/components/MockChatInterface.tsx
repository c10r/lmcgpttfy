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
          <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center">
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
          <div className="w-[min(760px,90vw)] mx-auto">
            <div
              className={`relative flex items-center bg-card border rounded-full px-4 py-3 shadow-sm transition-all ${
                phase === "clicking" || phase === "typing" || phase === "submitting"
                  ? "border-foreground/30 ring-1 ring-foreground/10"
                  : "border-border"
              }`}
            >
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
            <button
              className={`ml-3 p-2 rounded-full transition-all duration-150 ${
                phase === "typing" || phase === "submitting" || phase === "redirecting"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              } ${sendClicked ? "scale-95" : ""}`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
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
