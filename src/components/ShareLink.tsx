import { useState } from "react";
import { Copy, Check, Link } from "lucide-react";

interface ShareLinkProps {
  link: string;
}

export const ShareLink = ({ link }: ShareLinkProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fade-in-up w-full max-w-2xl mx-auto mt-8">
      <p className="text-center text-muted-foreground text-sm mb-3">
        Share this link with someone who needs a little... guidance 😏
      </p>
      <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-2">
        <div className="flex items-center gap-2 flex-1 px-3 py-2 bg-secondary/50 rounded-lg overflow-hidden">
          <Link className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-foreground text-sm truncate">{link}</span>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
};
