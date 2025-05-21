import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

interface MobileHeaderProps {
  onOpenSidebar: () => void;
}

export default function MobileHeader({ onOpenSidebar }: MobileHeaderProps) {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 z-20 border-b dark:border-gray-700 h-16 flex items-center px-4">
      <button 
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" 
        onClick={onOpenSidebar}
        aria-label="Open menu"
      >
        <i className="ri-menu-line text-xl dark:text-gray-300"></i>
      </button>
      
      <div className="flex items-center space-x-2 ml-2">
        <span className="text-primary text-xl">
          <i className="ri-bubble-chart-fill"></i>
        </span>
        <h1 className="font-bold text-lg text-primary">SocialSync</h1>
      </div>
      
      <div className="ml-auto">
        {user?.profileImage ? (
          <img 
            src={user.profileImage} 
            alt="User profile" 
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
            <i className="ri-user-line text-gray-500 dark:text-gray-400"></i>
          </div>
        )}
      </div>
    </div>
  );
}
