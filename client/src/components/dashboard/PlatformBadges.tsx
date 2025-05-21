import { ConnectedPlatform } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { PlatformIcon, getPlatformDisplayName } from "@/components/ui/platform-icon";

export default function PlatformBadges() {
  const { data: platforms, isLoading } = useQuery<ConnectedPlatform[]>({
    queryKey: ["/api/platforms"],
  });

  // Include bluesky even if not connected to match the design
  const allPlatforms = [
    { platform: "twitter", connected: false },
    { platform: "instagram", connected: false },
    { platform: "facebook", connected: false },
    { platform: "bluesky", connected: false },
  ] as const;

  // Merge actual connected platforms with the default list
  const displayPlatforms = platforms
    ? allPlatforms.map(p => {
        const connectedPlatform = platforms.find(cp => cp.platform === p.platform);
        return connectedPlatform 
          ? { ...p, connected: connectedPlatform.connected } 
          : p;
      })
    : allPlatforms;

  if (isLoading) {
    return (
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="platform-badge h-24 flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="mt-2 w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="mt-1 w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {displayPlatforms.map((p, index) => (
        <div 
          key={index} 
          className="platform-badge flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md cursor-pointer"
        >
          <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
            `bg-${p.platform} bg-opacity-10`
          }`}>
            <PlatformIcon platform={p.platform as any} size={20} />
          </div>
          <span className="mt-2 text-sm font-medium dark:text-white">{getPlatformDisplayName(p.platform as any)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {p.connected ? "Connected" : "Connect"}
          </span>
        </div>
      ))}
    </div>
  );
}
