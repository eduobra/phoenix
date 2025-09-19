import { useEffect, useState } from "react";

type TypewriterProps = {
  text: string;
  speed?: number;
};

export default function Typewriter({ text, speed = 20 }: TypewriterProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0); // reset when text changes
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= text.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <p className="text-sm whitespace-pre-wrap">{text.slice(0, index + 1)}</p>;
}
