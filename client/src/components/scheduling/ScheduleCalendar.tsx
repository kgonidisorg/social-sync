import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Post, PlatformType } from "@shared/schema";
import { getCalendarDays, getCurrentMonthName, getPreviousMonth, getNextMonth, formatTime } from "@/lib/date-utils";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ScheduleCalendarProps {
  fullWidth?: boolean;
}

export default function ScheduleCalendar({ fullWidth = false }: ScheduleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState(getCalendarDays(currentMonth));
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get scheduled posts from the API
  const { data: scheduledPosts, isLoading } = useQuery<Array<Post & { platforms: any[] }>>({
    queryKey: ["/api/posts/scheduled"],
  });
  
  // Update calendar days when month changes
  useEffect(() => {
    setCalendarDays(getCalendarDays(currentMonth));
  }, [currentMonth]);
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(getPreviousMonth(currentMonth));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(getNextMonth(currentMonth));
  };
  
  // Delete a scheduled post
  const deletePost = useMutation({
    mutationFn: async (postId: number) => {
      return apiRequest("DELETE", `/api/posts/${postId}`);
    },
    onSuccess: () => {
      toast({
        title: "Post deleted",
        description: "The scheduled post has been deleted.",
      });
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["/api/posts/scheduled"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting post",
        description: error.message || "There was an error deleting the post.",
        variant: "destructive",
      });
    }
  });
  
  // Get platform dots for calendar (posts for each day)
  const getPlatformDots = (day: Date) => {
    if (!scheduledPosts) return [];
    
    return scheduledPosts
      .filter(post => {
        if (!post.scheduledTime) return false;
        const postDate = new Date(post.scheduledTime);
        return postDate.getDate() === day.getDate() && 
               postDate.getMonth() === day.getMonth() && 
               postDate.getFullYear() === day.getFullYear();
      })
      .map(post => post.platforms[0]?.platform as PlatformType)
      .filter((platform, index, self) => self.indexOf(platform) === index);
  };
  
  // Get scheduled posts for today
  const getTodayScheduledPosts = () => {
    if (!scheduledPosts) return [];
    
    const today = new Date();
    
    return scheduledPosts
      .filter(post => {
        if (!post.scheduledTime) return false;
        const postDate = new Date(post.scheduledTime);
        return postDate.getDate() === today.getDate() && 
               postDate.getMonth() === today.getMonth() && 
               postDate.getFullYear() === today.getFullYear();
      })
      .sort((a, b) => {
        if (!a.scheduledTime || !b.scheduledTime) return 0;
        return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
      });
  };
  
  // Handle confirmation before deleting a post
  const handleDeletePost = (postId: number) => {
    if (confirm("Are you sure you want to delete this scheduled post?")) {
      deletePost.mutate(postId);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden p-4 ${fullWidth ? "w-full" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold dark:text-white">Upcoming Posts</h3>
        <div className="flex space-x-2">
          <button 
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
          >
            <i className="ri-arrow-left-s-line text-lg dark:text-gray-300"></i>
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            <i className="ri-arrow-right-s-line text-lg dark:text-gray-300"></i>
          </button>
        </div>
      </div>
      
      <div className="text-sm font-medium text-center text-gray-500 dark:text-gray-400 mb-4">
        <span>{getCurrentMonthName(currentMonth)}</span>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const platformDots = getPlatformDots(day.date);
          
          return (
            <div 
              key={index} 
              className={`calendar-day aspect-square flex items-center justify-center text-sm rounded-md ${
                day.isToday 
                  ? 'bg-primary text-white' 
                  : day.isCurrentMonth 
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100' 
                    : 'inactive text-gray-400 dark:text-gray-600'
              }`}
              aria-label={day.date.toDateString()}
            >
              {day.date.getDate()}
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {platformDots.slice(0, 2).map((platform, i) => (
                  <span
                    key={i}
                    className={`w-1 h-1 rounded-full bg-${platform === 'twitter' ? 'twitter' : platform === 'instagram' ? 'instagram' : platform === 'facebook' ? 'facebook' : 'bluesky'}`}
                    style={{ backgroundColor: platform === 'twitter' ? '#1DA1F2' : platform === 'instagram' ? '#E1306C' : platform === 'facebook' ? '#4267B2' : '#0063ff' }}
                  ></span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 space-y-3">
        <h4 className="font-medium text-gray-800 dark:text-gray-300">Scheduled for today</h4>
        
        {isLoading ? (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 h-28 animate-pulse flex flex-col justify-between">
            <div className="flex justify-between mb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
            <div className="flex mt-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12 mr-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
            </div>
          </div>
        ) : getTodayScheduledPosts().length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">No posts scheduled for today</p>
          </div>
        ) : (
          getTodayScheduledPosts().map(post => {
            const platform = post.platforms[0]?.platform as PlatformType;
            const time = post.scheduledTime ? formatTime(post.scheduledTime) : '';
            
            return (
              <div key={post.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: platform === 'twitter' ? '#1DA1F2' : platform === 'instagram' ? '#E1306C' : platform === 'facebook' ? '#4267B2' : '#0063ff' }}></span>
                    <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-300">{time}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <PlatformIcon platform={platform} size={14} className="mr-1" />
                    {platform === 'twitter' ? 'Twitter/X' : platform === 'instagram' ? 'Instagram' : platform === 'facebook' ? 'Facebook' : 'Bluesky'}
                  </div>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">{post.content}</p>
                <div className="flex mt-2">
                  <button className="text-xs text-primary hover:text-secondary mr-3">Edit</button>
                  <button 
                    className="text-xs text-red-500 hover:text-red-600"
                    onClick={() => handleDeletePost(post.id)}
                    disabled={deletePost.isPending}
                  >
                    {deletePost.isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })
        )}
        
        <Link href="/compose">
          <a className="block w-full py-2 text-sm font-medium text-primary hover:text-secondary border border-primary hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-10 rounded-lg mt-3 text-center">
            + Schedule New Post
          </a>
        </Link>
      </div>
    </div>
  );
}

// Helper to fix TypeScript errors
function Link(props: { href: string; children: React.ReactNode }) {
  return props.children;
}
