import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";

export default function PreferencesPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    postScheduled: true,
    postPublished: true,
    commentReceived: true,
    analyticsReport: true,
    newFollowers: false,
    platformUpdates: true,
    marketingEmails: false
  });
  
  // Time format preferences 
  const [timeFormat, setTimeFormat] = useState("12h");
  
  // Default posting platforms
  const [defaultPlatforms, setDefaultPlatforms] = useState({
    twitter: true,
    instagram: true,
    facebook: true,
    bluesky: false
  });
  
  // Language preference
  const [language, setLanguage] = useState("english");

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  const handleTimeFormatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeFormat(e.target.value);
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setDefaultPlatforms(prev => ({ ...prev, [name]: checked }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleSave = () => {
    // In a real app, we would save these settings to the server
    toast({
      title: "Preferences Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Preferences</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Customize your SocialSync experience.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Theme Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Display Settings
              </h2>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div 
                    className={`cursor-pointer rounded-lg border ${
                      theme === 'light' 
                        ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                        : 'border-gray-200 dark:border-gray-700'
                    } overflow-hidden`}
                    onClick={() => setTheme('light')}
                  >
                    <div className="h-20 bg-white"></div>
                    <div className="p-2 bg-gray-50 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-900">Light</span>
                    </div>
                  </div>
                  
                  <div 
                    className={`cursor-pointer rounded-lg border ${
                      theme === 'dark' 
                        ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                        : 'border-gray-200 dark:border-gray-700'
                    } overflow-hidden`}
                    onClick={() => setTheme('dark')}
                  >
                    <div className="h-20 bg-gray-900"></div>
                    <div className="p-2 bg-gray-800 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">Dark</span>
                    </div>
                  </div>
                  
                  <div 
                    className={`cursor-pointer rounded-lg border ${
                      theme === 'system' 
                        ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                        : 'border-gray-200 dark:border-gray-700'
                    } overflow-hidden`}
                    onClick={() => setTheme('system')}
                  >
                    <div className="h-20 bg-gradient-to-r from-white to-gray-900"></div>
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">System</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Time Format
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="timeFormat"
                      value="12h"
                      checked={timeFormat === "12h"}
                      onChange={handleTimeFormatChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">12-hour (1:30 PM)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="timeFormat"
                      value="24h"
                      checked={timeFormat === "24h"}
                      onChange={handleTimeFormatChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">24-hour (13:30)</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Language
                </label>
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="portuguese">Portuguese</option>
                  <option value="japanese">Japanese</option>
                  <option value="chinese">Chinese</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notification Settings
              </h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Digest
                    <p className="text-xs font-normal text-gray-500 dark:text-gray-400 mt-1">
                      Receive a weekly summary of your account activity
                    </p>
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailDigest"
                      className="sr-only peer"
                      checked={notifications.emailDigest}
                      onChange={handleNotificationChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Post Scheduled
                    <p className="text-xs font-normal text-gray-500 dark:text-gray-400 mt-1">
                      Get notified when a scheduled post is about to be published
                    </p>
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="postScheduled"
                      className="sr-only peer"
                      checked={notifications.postScheduled}
                      onChange={handleNotificationChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Post Published
                    <p className="text-xs font-normal text-gray-500 dark:text-gray-400 mt-1">
                      Get notified when your post is published
                    </p>
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="postPublished"
                      className="sr-only peer"
                      checked={notifications.postPublished}
                      onChange={handleNotificationChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Comment Received
                    <p className="text-xs font-normal text-gray-500 dark:text-gray-400 mt-1">
                      Get notified when someone comments on your post
                    </p>
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="commentReceived"
                      className="sr-only peer"
                      checked={notifications.commentReceived}
                      onChange={handleNotificationChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Analytics Report
                    <p className="text-xs font-normal text-gray-500 dark:text-gray-400 mt-1">
                      Receive monthly analytics report
                    </p>
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="analyticsReport"
                      className="sr-only peer"
                      checked={notifications.analyticsReport}
                      onChange={handleNotificationChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Marketing Emails
                    <p className="text-xs font-normal text-gray-500 dark:text-gray-400 mt-1">
                      Receive product updates and promotional emails
                    </p>
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="marketingEmails"
                      className="sr-only peer"
                      checked={notifications.marketingEmails}
                      onChange={handleNotificationChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {/* Default Platform Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Default Platforms
              </h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select which platforms should be selected by default when composing a new post.
              </p>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="twitter"
                    checked={defaultPlatforms.twitter}
                    onChange={handlePlatformChange}
                    className="h-4 w-4 text-[#1DA1F2] focus:ring-[#1DA1F2] rounded border-gray-300 dark:border-gray-600"
                  />
                  <div className="flex items-center ml-3">
                    <i className="ri-twitter-x-line text-[#1DA1F2] mr-2"></i>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Twitter/X</span>
                  </div>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="instagram"
                    checked={defaultPlatforms.instagram}
                    onChange={handlePlatformChange}
                    className="h-4 w-4 text-[#E1306C] focus:ring-[#E1306C] rounded border-gray-300 dark:border-gray-600"
                  />
                  <div className="flex items-center ml-3">
                    <i className="ri-instagram-line text-[#E1306C] mr-2"></i>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Instagram</span>
                  </div>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="facebook"
                    checked={defaultPlatforms.facebook}
                    onChange={handlePlatformChange}
                    className="h-4 w-4 text-[#4267B2] focus:ring-[#4267B2] rounded border-gray-300 dark:border-gray-600"
                  />
                  <div className="flex items-center ml-3">
                    <i className="ri-facebook-circle-fill text-[#4267B2] mr-2"></i>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Facebook</span>
                  </div>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="bluesky"
                    checked={defaultPlatforms.bluesky}
                    onChange={handlePlatformChange}
                    className="h-4 w-4 text-[#0063ff] focus:ring-[#0063ff] rounded border-gray-300 dark:border-gray-600"
                  />
                  <div className="flex items-center ml-3">
                    <i className="ri-cloud-line text-[#0063ff] mr-2"></i>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Bluesky</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Content Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Content Preferences
              </h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dashboard Layout
                </label>
                <select className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
                  <option>Standard</option>
                  <option>Compact</option>
                  <option>Expanded</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Analytics View
                </label>
                <select className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Calendar Default View
                </label>
                <select className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
                  <option>Month</option>
                  <option>Week</option>
                  <option>Day</option>
                  <option>List</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md shadow-sm text-sm font-medium hover:bg-secondary"
            >
              <i className="ri-save-line mr-2"></i> Save Preferences
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}