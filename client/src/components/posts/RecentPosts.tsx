import { useQuery } from "@tanstack/react-query";
import { Post, PlatformType } from "@shared/schema";
import { PlatformIcon, getPlatformDisplayName } from "@/components/ui/platform-icon";
import { formatDate, formatTime } from "@/lib/date-utils";

interface RecentPostsProps {
  showViewAll?: boolean;
  limit?: number;
}

export default function RecentPosts({ showViewAll = true, limit = 3 }: RecentPostsProps) {
  const { data: posts, isLoading } = useQuery<Array<Post & { platforms: any[] }>>({
    queryKey: ["/api/posts"],
  });
  
  const limitedPosts = posts?.slice(0, limit);
  
  const getPlatformIcon = (platform: PlatformType) => {
    return <PlatformIcon platform={platform} />;
  };
  
  const formatEngagement = (post: any) => {
    if (!post.platforms || post.platforms.length === 0) return null;
    
    const platform = post.platforms[0];
    
    return (
      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center"><i className="ri-heart-line mr-1"></i> {platform.likes || 0}</span>
        <span className="flex items-center"><i className="ri-chat-1-line mr-1"></i> {platform.comments || 0}</span>
        <span className="flex items-center">
          {post.platforms[0].platform === "facebook" ? (
            <i className="ri-share-forward-line mr-1"></i>
          ) : post.platforms[0].platform === "instagram" ? (
            <i className="ri-bookmark-line mr-1"></i>
          ) : (
            <i className="ri-repeat-line mr-1"></i>
          )} 
          {platform.shares || 0}
        </span>
      </div>
    );
  };

  return (
    <div className="mt-8 mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Posts</h2>
        {showViewAll && (
          <button className="text-sm text-primary hover:text-secondary font-medium">View All</button>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No posts found</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Content</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Platform</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Performance</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {limitedPosts?.map((post) => {
                  const platform = post.platforms && post.platforms.length > 0 
                    ? post.platforms[0].platform as PlatformType 
                    : null;
                  
                  return (
                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center max-w-md">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                            {post.mediaUrl ? (
                              <img 
                                src={post.mediaUrl} 
                                alt="Post media" 
                                className="h-full w-full object-cover" 
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400">
                                <i className="ri-image-line"></i>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                              {post.content}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {platform && (
                          <div className="flex items-center">
                            {getPlatformIcon(platform)}
                            <span className="text-sm text-gray-900 dark:text-gray-200 ml-2">
                              {getPlatformDisplayName(platform)}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-200">
                          {post.createdAt ? formatDate(post.createdAt) : ""}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {post.createdAt ? formatTime(post.createdAt) : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatEngagement(post)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          post.status === "published" 
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100" 
                            : post.status === "scheduled" 
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100" 
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                        }`}>
                          {post.status === "published" ? "Published" : post.status === "scheduled" ? "Scheduled" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary hover:text-secondary">Details</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
