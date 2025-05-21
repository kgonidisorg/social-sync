import MainLayout from "@/components/layout/MainLayout";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import PlatformBadges from "@/components/dashboard/PlatformBadges";
import PostComposer from "@/components/composer/PostComposer";
import PostPreviews from "@/components/composer/PostPreviews";
import ScheduleCalendar from "@/components/scheduling/ScheduleCalendar";
import AnalyticsOverview from "@/components/analytics/AnalyticsOverview";
import RecentPosts from "@/components/posts/RecentPosts";
import { useState } from "react";

export default function Dashboard() {
  const [postContent, setPostContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["twitter", "instagram", "facebook"]);
  
  return (
    <MainLayout>
      <WelcomeHeader />
      <PlatformBadges />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <PostComposer />
          <PostPreviews 
            content={postContent || "What's on your mind?"} 
            platforms={selectedPlatforms as any} 
          />
        </div>
        
        <div className="lg:col-span-1">
          <ScheduleCalendar />
        </div>
      </div>
      
      <AnalyticsOverview />
      <RecentPosts />
    </MainLayout>
  );
}
