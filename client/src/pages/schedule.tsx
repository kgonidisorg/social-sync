import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ScheduleCalendar from "@/components/scheduling/ScheduleCalendar";
import { useQuery } from "@tanstack/react-query";
import { formatDate, formatTime } from "@/lib/date-utils";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { PlatformType } from "@shared/schema";
import { Link } from "wouter";

export default function Schedule() {
  const [currentView, setCurrentView] = useState<"calendar" | "list">("calendar");
  
  const { data: scheduledPosts, isLoading } = useQuery<Array<any>>({
    queryKey: ["/api/posts/scheduled"],
  });

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Schedule</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and organize your scheduled posts across all platforms.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1">
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentView === "calendar" 
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" 
                  : "text-gray-600 dark:text-gray-300"
              }`}
              onClick={() => setCurrentView("calendar")}
            >
              <i className="ri-calendar-line mr-2"></i>Calendar
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentView === "list" 
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" 
                  : "text-gray-600 dark:text-gray-300"
              }`}
              onClick={() => setCurrentView("list")}
            >
              <i className="ri-list-check mr-2"></i>List
            </button>
          </div>
          <Link href="/compose">
            <a className="btn flex items-center px-4 py-2 bg-primary text-white rounded-md shadow-sm text-sm font-medium hover:bg-secondary focus:outline-none">
              <i className="ri-add-line mr-2"></i> Schedule Post
            </a>
          </Link>
        </div>
      </div>
      
      {currentView === "calendar" ? (
        <div className="grid grid-cols-1 gap-6">
          <ScheduleCalendar fullWidth />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b dark:border-gray-700">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Upcoming Scheduled Posts</h3>
          </div>
          
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !scheduledPosts || scheduledPosts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mb-4 text-gray-400 dark:text-gray-500">
                <i className="ri-calendar-line text-5xl"></i>
              </div>
              <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No scheduled posts</h4>
              <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                You don't have any posts scheduled. Create a new post and schedule it for later.
              </p>
              <Link href="/compose">
                <a className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md shadow-sm text-sm font-medium hover:bg-secondary focus:outline-none">
                  <i className="ri-add-line mr-2"></i> Schedule New Post
                </a>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {scheduledPosts.map((post) => {
                const platform = post.platforms && post.platforms.length > 0 
                  ? post.platforms[0].platform as PlatformType
                  : "twitter" as PlatformType;
                
                return (
                  <div key={post.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <PlatformIcon platform={platform} size={18} className="mr-2" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {post.scheduledTime ? formatDate(post.scheduledTime) : ""}
                        </span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {post.scheduledTime ? formatTime(post.scheduledTime) : ""}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                          <i className="ri-edit-line"></i>
                        </button>
                        <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 mb-3">{post.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {post.platforms && post.platforms.map((platform: any, index: number) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                          <PlatformIcon platform={platform.platform as PlatformType} size={12} className="mr-1" />
                          {platform.platform === "twitter" ? "Twitter/X" : 
                           platform.platform === "instagram" ? "Instagram" : 
                           platform.platform === "facebook" ? "Facebook" : "Bluesky"}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
}
