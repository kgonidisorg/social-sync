import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useRoute, Link } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { ConnectedPlatform, PlatformType } from "@shared/schema";
import { PlatformIcon, getPlatformDisplayName, getPlatformColor } from "@/components/ui/platform-icon";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function PlatformDetail() {
  const [_, params] = useRoute('/platforms/:platform');
  const [location, setLocation] = useLocation();
  const platformName = params?.platform as PlatformType;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [credentials, setCredentials] = useState({
    accessToken: "",
    refreshToken: "",
    platformUsername: "",
  });
  const [isConnected, setIsConnected] = useState(false);

  // Get all platform information
  const { data: platforms, isLoading } = useQuery<ConnectedPlatform[]>({
    queryKey: ["/api/platforms"],
  });

  // Find current platform data
  useEffect(() => {
    if (platforms) {
      const currentPlatform = platforms.find(p => p.platform === platformName);
      
      if (currentPlatform) {
        setIsConnected(currentPlatform.connected);
        setCredentials({
          accessToken: currentPlatform.accessToken || "",
          refreshToken: currentPlatform.refreshToken || "",
          platformUsername: currentPlatform.platformUsername || "",
        });
      }
    }
  }, [platforms, platformName]);

  // Validate platform name
  if (!platformName || !["twitter", "instagram", "facebook", "bluesky"].includes(platformName)) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invalid Platform</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            The platform you are looking for does not exist.
          </p>
          <Link href="/platforms">
            <a className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-white rounded-md shadow-sm text-sm font-medium hover:bg-secondary">
              Go back to Platforms
            </a>
          </Link>
        </div>
      </MainLayout>
    );
  }

  // For demo purposes, we'll simulate connecting/disconnecting a platform
  const connectPlatform = useMutation({
    mutationFn: async () => {
      // In a real app, this would be an API call to connect the platform
      // For now, we'll simulate the API call
      return apiRequest("POST", "/api/platforms", {
        platform: platformName,
        accessToken: credentials.accessToken,
        refreshToken: credentials.refreshToken,
        platformUsername: credentials.platformUsername,
        connected: true
      });
    },
    onSuccess: () => {
      setIsConnected(true);
      toast({
        title: "Connection Successful",
        description: `Your ${getPlatformDisplayName(platformName)} account has been connected.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/platforms"] });
    },
    onError: (err: any) => {
      toast({
        title: "Connection Failed",
        description: err.message || `Failed to connect your ${getPlatformDisplayName(platformName)} account. Please try again.`,
        variant: "destructive",
      });
    }
  });

  const disconnectPlatform = useMutation({
    mutationFn: async () => {
      // In a real app, this would be an API call to disconnect the platform
      // For now, we'll simulate the API call
      return apiRequest("POST", "/api/platforms/disconnect", {
        platform: platformName,
      });
    },
    onSuccess: () => {
      setIsConnected(false);
      toast({
        title: "Disconnected",
        description: `Your ${getPlatformDisplayName(platformName)} account has been disconnected.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/platforms"] });
    },
    onError: (err: any) => {
      toast({
        title: "Disconnection Failed",
        description: err.message || `Failed to disconnect your ${getPlatformDisplayName(platformName)} account. Please try again.`,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    connectPlatform.mutate();
  };

  const handleDisconnect = () => {
    if (window.confirm(`Are you sure you want to disconnect your ${getPlatformDisplayName(platformName)} account?`)) {
      disconnectPlatform.mutate();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  // Get the platform color for styling
  const platformColor = getPlatformColor(platformName);

  return (
    <MainLayout>
      <div className="mb-8">
        <Link href="/platforms">
          <a className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4">
            <i className="ri-arrow-left-line mr-1"></i> Back to Platforms
          </a>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <div
              className="w-12 h-12 flex items-center justify-center rounded-full bg-opacity-10 mr-4"
              style={{ backgroundColor: `${platformColor}20` }}
            >
              <PlatformIcon platform={platformName} size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getPlatformDisplayName(platformName)}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isConnected 
                  ? `Manage your ${getPlatformDisplayName(platformName)} connection settings.` 
                  : `Connect your ${getPlatformDisplayName(platformName)} account to post content.`}
              </p>
            </div>
          </div>

          {isConnected && (
            <button
              onClick={handleDisconnect}
              className="mt-4 md:mt-0 px-4 py-2 border border-red-500 text-red-500 dark:text-red-400 dark:border-red-400 rounded-md text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500 dark:hover:bg-opacity-10"
              disabled={disconnectPlatform.isPending}
            >
              {disconnectPlatform.isPending ? "Disconnecting..." : "Disconnect Account"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isConnected ? "Connection Settings" : "Connect Your Account"}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {isConnected ? (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Connected Account
                      </label>
                      <span className="text-green-600 dark:text-green-400 text-xs flex items-center">
                        <i className="ri-checkbox-circle-fill mr-1"></i> Connected
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 border dark:border-gray-700 p-3 rounded-md bg-gray-50 dark:bg-gray-700">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-opacity-10" style={{ backgroundColor: `${platformColor}20` }}>
                        <PlatformIcon platform={platformName} size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {credentials.platformUsername ? `@${credentials.platformUsername}` : "Connected Account"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Connected on {new Date().toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Access Token
                    </label>
                    <div className="flex items-center">
                      <input
                        type="password"
                        value="••••••••••••••••••••••••••••••••"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 shadow-sm focus:ring-0 focus:border-gray-300 cursor-not-allowed"
                        disabled
                      />
                      <button
                        type="button"
                        className="ml-2 p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Refresh Token
                    </label>
                    <div className="flex items-center">
                      <input
                        type="password"
                        value="••••••••••••••••••••••••••••••••"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 shadow-sm focus:ring-0 focus:border-gray-300 cursor-not-allowed"
                        disabled
                      />
                      <button
                        type="button"
                        className="ml-2 p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={credentials.platformUsername}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 shadow-sm focus:ring-0 focus:border-gray-300 cursor-not-allowed"
                      disabled
                    />
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md shadow-sm text-sm font-medium hover:bg-secondary"
                  >
                    <i className="ri-refresh-line mr-2"></i> Refresh Tokens
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      API Access Token
                    </label>
                    <input
                      type="text"
                      name="accessToken"
                      value={credentials.accessToken}
                      onChange={handleInputChange}
                      placeholder="Enter your API access token"
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      You can find this in your {getPlatformDisplayName(platformName)} developer dashboard.
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      API Refresh Token
                    </label>
                    <input
                      type="text"
                      name="refreshToken"
                      value={credentials.refreshToken}
                      onChange={handleInputChange}
                      placeholder="Enter your API refresh token"
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {getPlatformDisplayName(platformName)} Username
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                        @
                      </span>
                      <input
                        type="text"
                        name="platformUsername"
                        value={credentials.platformUsername}
                        onChange={handleInputChange}
                        placeholder="username"
                        className="block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md shadow-sm text-sm font-medium hover:bg-secondary disabled:opacity-70"
                      disabled={connectPlatform.isPending}
                    >
                      {connectPlatform.isPending ? (
                        <>
                          <i className="ri-loader-4-line animate-spin mr-2"></i> Connecting...
                        </>
                      ) : (
                        <>
                          <i className="ri-link mr-2"></i> Connect Account
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setLocation("/platforms")}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Connection Guide
              </h2>
            </div>
            <div className="p-6">
              <ol className="space-y-4 text-sm">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center mr-2 text-xs">1</span>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">Get your API keys</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      Go to the {getPlatformDisplayName(platformName)} Developer Portal and create a new app to get your API keys.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center mr-2 text-xs">2</span>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">Set permissions</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      Make sure to set read and write permissions for your app to post content.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center mr-2 text-xs">3</span>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">Enter credentials</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      Copy the access token, refresh token, and your username into the form.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center mr-2 text-xs">4</span>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">Connect your account</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      Click the Connect Account button to link your {getPlatformDisplayName(platformName)} account.
                    </p>
                  </div>
                </li>
              </ol>
              <a
                href="#"
                className="text-primary hover:text-secondary text-sm flex items-center mt-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ri-external-link-line mr-1"></i> Visit {getPlatformDisplayName(platformName)} Developer Portal
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Account Limits
              </h2>
            </div>
            <div className="p-6">
              {platformName === "twitter" && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">Posts per day</span>
                      <span className="text-gray-900 dark:text-white font-medium">50/100</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "50%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">Media uploads</span>
                      <span className="text-gray-900 dark:text-white font-medium">20/40</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "50%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">API Calls</span>
                      <span className="text-gray-900 dark:text-white font-medium">300/500</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                </div>
              )}

              {platformName === "instagram" && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">Posts per day</span>
                      <span className="text-gray-900 dark:text-white font-medium">10/25</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "40%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">Media uploads</span>
                      <span className="text-gray-900 dark:text-white font-medium">15/30</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "50%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">API Calls</span>
                      <span className="text-gray-900 dark:text-white font-medium">200/500</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "40%" }}></div>
                    </div>
                  </div>
                </div>
              )}

              {platformName === "facebook" && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">Posts per day</span>
                      <span className="text-gray-900 dark:text-white font-medium">25/50</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "50%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">Media uploads</span>
                      <span className="text-gray-900 dark:text-white font-medium">30/50</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">API Calls</span>
                      <span className="text-gray-900 dark:text-white font-medium">150/300</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "50%" }}></div>
                    </div>
                  </div>
                </div>
              )}

              {platformName === "bluesky" && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">Posts per day</span>
                      <span className="text-gray-900 dark:text-white font-medium">40/100</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "40%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">Media uploads</span>
                      <span className="text-gray-900 dark:text-white font-medium">20/50</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "40%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">API Calls</span>
                      <span className="text-gray-900 dark:text-white font-medium">100/300</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "33%" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}