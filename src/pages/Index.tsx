import { useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { ShareLink } from "@/components/ShareLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const handleSubmit = (query: string) => {
    const encoded = encodeURIComponent(query);
    const link = `${window.location.origin}/s/${encoded}`;
    setGeneratedLink(link);
  };

  const handleReset = () => {
    setGeneratedLink(null);
  };

  return (
    <div className="min-h-screen chat-container flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-foreground font-semibold">Let Me ChatGPT That For You</h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-12 max-w-xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            For those <span className="sarcasm-text">"quick questions"</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            When someone asks you something they could have easily asked an AI themselves.
          </p>
        </div>

        {!generatedLink ? (
          <div className="w-full max-w-3xl">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Type the question they should have asked:
            </p>
            <ChatInput 
              onSubmit={handleSubmit} 
              placeholder="What's the capital of France?"
            />
          </div>
        ) : (
          <div className="w-full">
            <ShareLink link={generatedLink} />
            <div className="text-center mt-6">
              <button
                onClick={handleReset}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                Create another link
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-xs text-muted-foreground">
          A loving tribute to{" "}
          <a 
            href="https://lmgtfy.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            LMGTFY
          </a>
          {" "}• Made with mild frustration 💚
        </p>
      </footer>
    </div>
  );
};

export default Index;
