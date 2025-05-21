import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlatformType } from "@shared/schema";
import { PlatformBadge } from "@/components/ui/platform-icon";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PostComposerProps {
  fullWidth?: boolean;
}

export default function PostComposer({ fullWidth = false }: PostComposerProps) {
  const [activeTab, setActiveTab] = useState<"compose" | "media" | "options">("compose");
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>(["twitter", "instagram", "facebook"]);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [scheduleTime, setScheduleTime] = useState<string>("12:00");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleCharCount = () => {
    let maxChars = 280; // Twitter default
    
    if (content.length > maxChars) {
      return `${content.length}/${maxChars}`;
    }
    
    return `${content.length}/${maxChars}`;
  };

  const handleTogglePlatform = (platform: PlatformType) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const createPost = useMutation({
    mutationFn: async (isScheduled: boolean) => {
      if (!content.trim()) {
        throw new Error("Please add some content to your post");
      }
      
      if (selectedPlatforms.length === 0) {
        throw new Error("Please select at least one platform");
      }
      
      const postData: any = {
        content,
        platforms: selectedPlatforms,
        status: isScheduled ? "scheduled" : "published"
      };
      
      if (isScheduled) {
        if (!scheduleDate || !scheduleTime) {
          throw new Error("Please select both date and time for scheduling");
        }
        
        const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
        postData.scheduledTime = scheduledDateTime.toISOString();
      }
      
      return apiRequest("POST", "/api/posts", postData);
    },
    onSuccess: () => {
      // Reset form
      setContent("");
      setShowScheduler(false);
      
      // Show success message
      toast({
        title: "Success!",
        description: "Your post has been created successfully.",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/scheduled"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating post",
        description: error.message || "There was an error creating your post.",
        variant: "destructive",
      });
    }
  });

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${fullWidth ? "w-full" : ""}`}>
      <div className="border-b dark:border-gray-700">
        <div className="flex">
          <button 
            className={`composer-tab flex-1 py-4 px-4 text-center font-medium text-gray-600 dark:text-gray-300 ${activeTab === "compose" ? "active" : ""}`}
            onClick={() => setActiveTab("compose")}
          >
            <i className="ri-edit-line mr-2"></i> Compose
          </button>
          <button 
            className={`composer-tab flex-1 py-4 px-4 text-center font-medium text-gray-600 dark:text-gray-300 ${activeTab === "media" ? "active" : ""}`}
            onClick={() => setActiveTab("media")}
          >
            <i className="ri-image-line mr-2"></i> Media
          </button>
          <button 
            className={`composer-tab flex-1 py-4 px-4 text-center font-medium text-gray-600 dark:text-gray-300 ${activeTab === "options" ? "active" : ""}`}
            onClick={() => setActiveTab("options")}
          >
            <i className="ri-settings-line mr-2"></i> Options
          </button>
        </div>
      </div>
      
      <div className="p-5">
        {activeTab === "compose" && (
          <>
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {["twitter", "instagram", "facebook", "bluesky"].map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform as PlatformType);
                  
                  if (isSelected) {
                    return (
                      <PlatformBadge 
                        key={platform} 
                        platform={platform as PlatformType}
                        onRemove={() => handleTogglePlatform(platform as PlatformType)}
                      />
                    );
                  }
                  
                  return null;
                })}
                <button 
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => {
                    const availablePlatforms = ["twitter", "instagram", "facebook", "bluesky"].filter(
                      p => !selectedPlatforms.includes(p as PlatformType)
                    );
                    
                    if (availablePlatforms.length > 0) {
                      handleTogglePlatform(availablePlatforms[0] as PlatformType);
                    }
                  }}
                >
                  <i className="ri-add-line mr-1"></i> Add Platform
                </button>
              </div>
              <textarea 
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white" 
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>
            
            <div className="mb-4 flex items-center gap-3">
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 rounded-full">
                <i className="ri-image-add-line text-xl"></i>
              </button>
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 rounded-full">
                <i className="ri-video-add-line text-xl"></i>
              </button>
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 rounded-full">
                <i className="ri-link text-xl"></i>
              </button>
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 rounded-full">
                <i className="ri-emotion-line text-xl"></i>
              </button>
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 rounded-full">
                <i className="ri-map-pin-line text-xl"></i>
              </button>
              <div className="ml-auto flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">{handleCharCount()}</span>
              </div>
            </div>
            
            <div className="border-t dark:border-gray-700 pt-4 flex justify-between items-center">
              <div className="relative">
                <button 
                  className="flex items-center space-x-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  onClick={() => setShowScheduler(!showScheduler)}
                >
                  <i className="ri-time-line"></i>
                  <span>Schedule for later</span>
                  <i className={`ri-arrow-${showScheduler ? 'up' : 'down'}-s-line`}></i>
                </button>
                
                {showScheduler && (
                  <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                    <div className="p-3">
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                        <input 
                          type="date" 
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                        <input 
                          type="time" 
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                        />
                      </div>
                      <button 
                        className="mt-3 w-full py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-secondary"
                        onClick={() => {
                          createPost.mutate(true);
                        }}
                        disabled={createPost.isPending}
                      >
                        {createPost.isPending ? "Scheduling..." : "Set Schedule Time"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button 
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => createPost.mutate(false)}
                disabled={createPost.isPending || !content.trim() || selectedPlatforms.length === 0}
              >
                {createPost.isPending ? "Posting..." : "Post Now"}
              </button>
            </div>
          </>
        )}
        
        {activeTab === "media" && (
          <div className="py-10">
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 mb-4">
                <i className="ri-image-add-line text-4xl"></i>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Drag and drop files here or</p>
              <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-secondary">
                Browse Files
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                Supported formats: JPEG, PNG, GIF, MP4
              </p>
            </div>
          </div>
        )}
        
        {activeTab === "options" && (
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Audience</label>
              <select className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-primary">
                <option>Public</option>
                <option>Followers only</option>
                <option>Close friends</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600" />
                <span>Allow comments</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600" />
                <span>Cross-post comments between platforms</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600" />
                <span>Add location data</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
