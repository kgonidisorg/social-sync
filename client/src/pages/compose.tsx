import MainLayout from "@/components/layout/MainLayout";
import PostComposer from "@/components/composer/PostComposer";
import PostPreviews from "@/components/composer/PostPreviews";
import { useState } from "react";

export default function Compose() {
  const [postContent, setPostContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["twitter", "instagram", "facebook", "bluesky"]);
  
  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compose New Post</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and schedule content for multiple platforms.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PostComposer fullWidth />
          <PostPreviews 
            content={postContent || "What's on your mind?"} 
            platforms={selectedPlatforms as any} 
          />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden p-5">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Posting Tips</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 mt-0.5 mr-2"></i>
                <span>Add relevant hashtags to increase discoverability</span>
              </li>
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 mt-0.5 mr-2"></i>
                <span>Keep your posts concise and engaging</span>
              </li>
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 mt-0.5 mr-2"></i>
                <span>Include a clear call-to-action</span>
              </li>
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 mt-0.5 mr-2"></i>
                <span>Add high-quality images or videos when possible</span>
              </li>
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 mt-0.5 mr-2"></i>
                <span>Post at optimal times for your audience</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden p-5">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Platform Guidelines</h3>
            <div className="space-y-4 text-sm">
              <div>
                <div className="flex items-center text-[#1DA1F2] mb-1 font-medium">
                  <i className="ri-twitter-x-line mr-2"></i> Twitter/X
                </div>
                <p className="text-gray-600 dark:text-gray-400">280 characters max, images enhance engagement.</p>
              </div>
              <div>
                <div className="flex items-center text-[#E1306C] mb-1 font-medium">
                  <i className="ri-instagram-line mr-2"></i> Instagram
                </div>
                <p className="text-gray-600 dark:text-gray-400">Visual content focused, use up to 30 hashtags.</p>
              </div>
              <div>
                <div className="flex items-center text-[#4267B2] mb-1 font-medium">
                  <i className="ri-facebook-circle-fill mr-2"></i> Facebook
                </div>
                <p className="text-gray-600 dark:text-gray-400">Longer form content, videos perform well.</p>
              </div>
              <div>
                <div className="flex items-center text-[#0063ff] mb-1 font-medium">
                  <i className="ri-cloud-line mr-2"></i> Bluesky
                </div>
                <p className="text-gray-600 dark:text-gray-400">300 characters, supports rich text and image attachment.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
