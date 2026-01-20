import { useState, useEffect } from "react";

interface TypedTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  showCursor?: boolean;
  className?: string;
}

export const TypedText = ({ 
  text, 
  speed = 80, 
  onComplete, 
  showCursor = true,
  className = ""
}: TypedTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (displayedText.length < text.length) {
      // Random delay to simulate human typing (sometimes faster, sometimes pauses)
      const randomDelay = speed + Math.random() * speed * 0.8;
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, randomDelay);
      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      // Small delay before triggering onComplete
      const timeout = setTimeout(() => {
        onComplete?.();
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, text, speed, onComplete, isComplete]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isComplete && <span className="typing-cursor" />}
    </span>
  );
};
