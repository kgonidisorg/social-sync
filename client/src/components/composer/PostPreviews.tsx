import { useState, useEffect } from "react";
import { PlatformType } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

interface PostPreviewsProps {
  content?: string;
  platforms?: PlatformType[];
}

export default function PostPreviews({ content = "What's on your mind?", platforms = ["twitter", "instagram"] }: PostPreviewsProps) {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });
  
  const [visiblePlatforms, setVisiblePlatforms] = useState<PlatformType[]>(platforms.slice(0, 2));

  // Update visible platforms if props change
  useEffect(() => {
    setVisiblePlatforms(platforms.slice(0, 2));
  }, [platforms]);

  const getProfileImage = () => {
    return user?.profileImage || "https://i.pravatar.cc/150?img=23";
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Post Preview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visiblePlatforms.includes("twitter") && (
          <div className="post-preview bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md">
            <div className="p-4">
              <div className="flex items-start">
                <img src={getProfileImage()} alt="User profile" className="w-10 h-10 rounded-full object-cover" />
                
                <div className="ml-3 flex-1">
                  <div className="flex items-center">
                    <span className="font-bold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">@{user?.username || "username"}</span>
                    <i className="ri-twitter-x-line ml-auto text-[#1DA1F2]"></i>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 mt-1">{content}</p>
                  <div className="flex items-center mt-3 text-gray-500 dark:text-gray-400 text-sm">
                    <span className="mr-4 flex items-center hover:text-[#1DA1F2] cursor-pointer">
                      <i className="ri-chat-1-line mr-1"></i> 0
                    </span>
                    <span className="mr-4 flex items-center hover:text-[#1DA1F2] cursor-pointer">
                      <i className="ri-repeat-line mr-1"></i> 0
                    </span>
                    <span className="mr-4 flex items-center hover:text-[#1DA1F2] cursor-pointer">
                      <i className="ri-heart-line mr-1"></i> 0
                    </span>
                    <span className="flex items-center hover:text-[#1DA1F2] cursor-pointer">
                      <i className="ri-upload-line mr-1"></i> 0
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {visiblePlatforms.includes("instagram") && (
          <div className="post-preview bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md">
            <div className="border-b dark:border-gray-700 p-3 flex items-center">
              <img src={getProfileImage()} alt="User profile" className="w-8 h-8 rounded-full object-cover" />
              <span className="font-semibold ml-2 dark:text-white">{user?.username || "username"}</span>
              <span className="ml-auto text-gray-400 dark:text-gray-500">
                <i className="ri-more-fill"></i>
              </span>
              <i className="ri-instagram-line ml-2 text-[#E1306C]"></i>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 h-40 flex items-center justify-center text-gray-400 dark:text-gray-500">
              <div className="text-center">
                <i className="ri-image-add-line text-3xl"></i>
                <p className="text-sm mt-1">Add image or video</p>
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center text-lg mb-2 dark:text-gray-300">
                <i className="ri-heart-line mr-3"></i>
                <i className="ri-chat-1-line mr-3"></i>
                <i className="ri-send-plane-line"></i>
                <i className="ri-bookmark-line ml-auto"></i>
              </div>
              <div className="text-sm dark:text-gray-200">
                <p className="font-semibold">0 likes</p>
                <p>
                  <span className="font-semibold">{user?.username || "username"}</span> {content}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {visiblePlatforms.includes("facebook") && (
          <div className="post-preview bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md">
            <div className="p-4">
              <div className="flex items-start">
                <img src={getProfileImage()} alt="User profile" className="w-10 h-10 rounded-full object-cover" />
                
                <div className="ml-3 flex-1">
                  <div className="flex items-center">
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</span>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <span>Just now</span>
                        <span className="mx-1">•</span>
                        <i className="ri-earth-line"></i>
                      </div>
                    </div>
                    <i className="ri-facebook-circle-fill ml-auto text-[#4267B2]"></i>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 mt-1">{content}</p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t dark:border-gray-700">
                    <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-[#4267B2]">
                      <i className="ri-thumb-up-line mr-1"></i> Like
                    </button>
                    <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-[#4267B2]">
                      <i className="ri-chat-1-line mr-1"></i> Comment
                    </button>
                    <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-[#4267B2]">
                      <i className="ri-share-forward-line mr-1"></i> Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {visiblePlatforms.includes("bluesky") && (
          <div className="post-preview bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md">
            <div className="p-4">
              <div className="flex items-start">
                <img src={getProfileImage()} alt="User profile" className="w-10 h-10 rounded-full object-cover" />
                
                <div className="ml-3 flex-1">
                  <div className="flex items-center">
                    <span className="font-bold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">@{user?.username || "username"}.bsky.social</span>
                    <i className="ri-cloud-line ml-auto text-[#0063ff]"></i>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 mt-1">{content}</p>
                  <div className="flex items-center mt-3 text-gray-500 dark:text-gray-400 text-sm">
                    <span className="mr-4 flex items-center hover:text-[#0063ff] cursor-pointer">
                      <i className="ri-heart-line mr-1"></i> 0
                    </span>
                    <span className="mr-4 flex items-center hover:text-[#0063ff] cursor-pointer">
                      <i className="ri-chat-1-line mr-1"></i> 0
                    </span>
                    <span className="mr-4 flex items-center hover:text-[#0063ff] cursor-pointer">
                      <i className="ri-repeat-line mr-1"></i> 0
                    </span>
                    <span className="flex items-center hover:text-[#0063ff] cursor-pointer">
                      <i className="ri-more-line mr-1"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
