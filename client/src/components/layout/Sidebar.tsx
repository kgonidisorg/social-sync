import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { PlatformIcon } from "@/components/ui/platform-icon";

export default function Sidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const [location] = useLocation();
  
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const navItems = [
    { 
      title: "Main", 
      items: [
        { name: "Dashboard", path: "/", icon: "ri-dashboard-line" },
        { name: "Compose", path: "/compose", icon: "ri-edit-box-line" },
        { name: "Schedule", path: "/schedule", icon: "ri-calendar-line" },
        { name: "Analytics", path: "/analytics", icon: "ri-line-chart-line" }
      ]
    },
    {
      title: "Platforms",
      items: [
        { name: "Twitter/X", path: "/platforms/twitter", icon: <PlatformIcon platform="twitter" /> },
        { name: "Instagram", path: "/platforms/instagram", icon: <PlatformIcon platform="instagram" /> },
        { name: "Facebook", path: "/platforms/facebook", icon: <PlatformIcon platform="facebook" /> },
        { name: "Bluesky", path: "/platforms/bluesky", icon: <PlatformIcon platform="bluesky" /> }
      ]
    },
    {
      title: "Settings",
      items: [
        { name: "Account", path: "/settings/account", icon: "ri-user-settings-line" },
        { name: "Preferences", path: "/settings/preferences", icon: "ri-settings-line" },
        { name: "Help", path: "/help", icon: "ri-question-line" }
      ]
    }
  ];

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 -translate-x-full" id="sidebar">
      <div className="flex items-center justify-between px-4 h-16 border-b dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-primary text-2xl">
            <i className="ri-bubble-chart-fill"></i>
          </span>
          <h1 className="font-bold text-xl text-primary">SocialSync</h1>
        </div>
        <button 
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" 
          onClick={onCloseMobile}
          aria-label="Close sidebar"
        >
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>

      <nav className="mt-4 px-2">
        {navItems.map((section, index) => (
          <div className="mb-6" key={index}>
            <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {section.title}
            </div>
            {section.items.map((item, itemIndex) => {
              const isActive = location === item.path;
              return (
                <Link 
                  key={itemIndex} 
                  href={item.path}
                  onClick={handleNavClick}
                >
                  <a 
                    className={`nav-item flex items-center px-4 py-3 rounded-md font-medium ${
                      isActive ? 'text-primary bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {typeof item.icon === 'string' ? (
                      <i className={`${item.icon} mr-3 text-lg`}></i>
                    ) : (
                      <span className="mr-3">{item.icon}</span>
                    )}
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t dark:border-gray-700">
        <div className="flex items-center">
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
          <div className="ml-3">
            <p className="font-medium text-sm dark:text-white">
              {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email || 'user@example.com'}
            </p>
          </div>
          <button className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <i className="ri-logout-box-r-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
