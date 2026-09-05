import { Facebook, Linkedin, Mail, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      color: "hover:text-[#25D366]",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "hover:text-[#1877F2]",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: "hover:text-[#0A66C2]",
    },
    {
      name: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this article: ${url}`)}`,
      color: "hover:text-brand-red",
    },
  ];

  return (
    <div className="rt-share-buttons">
      <div className="rt-share-label">
        <span>Share Article</span>
      </div>
      <div className="rt-share-icons">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rt-share-icon group"
            aria-label={`Share on ${link.name}`}
          >
            <link.icon 
              size={18} 
              strokeWidth={2} 
              className={`transition-colors ${link.color}`}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
