import { 
  Twitter, 
  Linkedin, 
  FacebookIcon, 
  CloudIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PlatformType } from "@shared/schema";

interface PlatformIconProps {
  platform: PlatformType;
  className?: string;
  size?: number;
}

export function PlatformIcon({ platform, className, size = 18 }: PlatformIconProps) {
  switch (platform) {
    case "twitter":
      return <Twitter className={cn("text-[#1DA1F2]", className)} size={size} />;
    case "instagram":
      return <Linkedin className={cn("text-[#E1306C]", className)} size={size} />;
    case "facebook":
      return <FacebookIcon className={cn("text-[#4267B2]", className)} size={size} />;
    case "bluesky":
      return <CloudIcon className={cn("text-[#0063ff]", className)} size={size} />;
    default:
      return null;
  }
}

interface PlatformBadgeProps {
  platform: PlatformType;
  children?: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

export function PlatformBadge({ platform, children, onRemove, className }: PlatformBadgeProps) {
  const getBgColor = () => {
    switch (platform) {
      case "twitter": return "bg-[#1DA1F2] bg-opacity-10 text-[#1DA1F2]";
      case "instagram": return "bg-[#E1306C] bg-opacity-10 text-[#E1306C]";
      case "facebook": return "bg-[#4267B2] bg-opacity-10 text-[#4267B2]";
      case "bluesky": return "bg-[#0063ff] bg-opacity-10 text-[#0063ff]";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
      getBgColor(),
      className
    )}>
      <PlatformIcon platform={platform} className="mr-1" size={14} />
      {children || getPlatformDisplayName(platform)}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 opacity-60 hover:opacity-100"
          aria-label={`Remove ${platform}`}
        >
          <span className="sr-only">Remove</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </span>
  );
}

export function getPlatformDisplayName(platform: PlatformType): string {
  switch (platform) {
    case "twitter": return "Twitter/X";
    case "instagram": return "Instagram";
    case "facebook": return "Facebook";
    case "bluesky": return "Bluesky";
    default: return platform;
  }
}

export function getPlatformColor(platform: PlatformType): string {
  switch (platform) {
    case "twitter": return "#1DA1F2";
    case "instagram": return "#E1306C";
    case "facebook": return "#4267B2";
    case "bluesky": return "#0063ff";
    default: return "#6B7280";
  }
}
