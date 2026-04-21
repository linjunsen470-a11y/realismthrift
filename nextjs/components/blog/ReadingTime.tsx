import { Clock } from "lucide-react";

interface ReadingTimeProps {
  content: any; // Sanity Portable Text
  className?: string;
}

export function ReadingTime({ content, className = "" }: ReadingTimeProps) {
  const calculateReadingTime = (blocks: any[]) => {
    if (!blocks || !Array.isArray(blocks)) return 1;

    const wordsPerMinute = 200;
    let totalWordCount = 0;

    blocks.forEach((block) => {
      if (block._type === "block" && block.children) {
        block.children.forEach((child: any) => {
          if (child.text) {
            totalWordCount += child.text.split(/\s+/).length;
          }
        });
      }
    });

    const readingTime = Math.ceil(totalWordCount / wordsPerMinute);
    return readingTime > 0 ? readingTime : 1;
  };

  const minutes = calculateReadingTime(content);

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Clock size={13} strokeWidth={2.5} className="text-brand-gold" />
      <span className="tracking-wide uppercase text-[0.7rem] font-bold opacity-80">
        {minutes} min read
      </span>
    </span>
  );
}
