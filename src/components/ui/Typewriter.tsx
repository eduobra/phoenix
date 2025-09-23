interface TypewriterProps {
  text: string;
}

export default function Typewriter({ text }: TypewriterProps) {
  return <p className="text-sm whitespace-pre-wrap">{text}</p>;
}
