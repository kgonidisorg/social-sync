import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { ConnectedPlatform, PlatformType } from "@shared/schema";
import { PlatformIcon, getPlatformDisplayName } from "@/components/ui/platform-icon";

export default function PlatformsPage() {
  const [location, setLocation] = useLocation();
  const { data: platforms, isLoading } = useQuery<ConnectedPlatform[]>({
    queryKey: ["/api/platforms"],
  });

  // Include all platforms regardless of connection status
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
          ? { 
              ...p, 
              connected: connectedPlatform.connected,
              platformUsername: connectedPlatform.platformUsername
            } 
          : p;
      })
    : allPlatforms;

  const handlePlatformClick = (platform: PlatformType) => {
    setLocation(`/platforms/${platform}`);
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Connected Platforms</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your social media account connections and credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayPlatforms.map((p, index) => (
          <div
            key={index}
            onClick={() => handlePlatformClick(p.platform as PlatformType)}
            className="platform-badge flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md cursor-pointer"
          >
            <div
              className={`w-16 h-16 flex items-center justify-center rounded-full ${
                `bg-opacity-10`
              }`}
              style={{ backgroundColor: `${p.platform === 'twitter' ? 'rgba(29, 161, 242, 0.1)' : p.platform === 'instagram' ? 'rgba(225, 48, 108, 0.1)' : p.platform === 'facebook' ? 'rgba(66, 103, 178, 0.1)' : 'rgba(0, 99, 255, 0.1)'}`}}
            >
              <PlatformIcon platform={p.platform as PlatformType} size={32} />
            </div>
            <h3 className="mt-4 text-lg font-medium dark:text-white">
              {getPlatformDisplayName(p.platform as PlatformType)}
            </h3>
            <div className="mt-2 text-sm">
              {p.connected ? (
                <span className="text-green-600 dark:text-green-400 flex items-center">
                  <i className="ri-checkbox-circle-fill mr-1"></i> Connected
                </span>
              ) : (
                <span className="text-gray-500 dark:text-gray-400 flex items-center">
                  <i className="ri-close-circle-line mr-1"></i> Not Connected
                </span>
              )}
            </div>
            {p.platformUsername && (
              <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                @{p.platformUsername}
              </span>
            )}
            <div className="mt-4 w-full">
              <button
                className={`w-full py-2 rounded-md text-sm font-medium ${
                  p.connected
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    : "bg-primary text-white hover:bg-secondary"
                }`}
              >
                {p.connected ? "Manage Connection" : "Connect Account"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Platform Permissions and Usage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              What we access
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 mt-0.5 mr-2"></i>
                <span>Post on your behalf (only when you explicitly request)</span>
              </li>
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 mt-0.5 mr-2"></i>
                <span>Read your profile information and account stats</span>
              </li>
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 mt-0.5 mr-2"></i>
                <span>Access engagement metrics for your content</span>
              </li>
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 mt-0.5 mr-2"></i>
                <span>Monitor your audience growth and reach</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Security Information
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <i className="ri-shield-check-line text-primary mt-0.5 mr-2"></i>
                <span>Your credentials are encrypted and stored securely</span>
              </li>
              <li className="flex items-start">
                <i className="ri-shield-check-line text-primary mt-0.5 mr-2"></i>
                <span>OAuth tokens are used instead of passwords whenever possible</span>
              </li>
              <li className="flex items-start">
                <i className="ri-shield-check-line text-primary mt-0.5 mr-2"></i>
                <span>You can revoke access at any time</span>
              </li>
              <li className="flex items-start">
                <i className="ri-shield-check-line text-primary mt-0.5 mr-2"></i>
                <span>We never share your account information with third parties</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}