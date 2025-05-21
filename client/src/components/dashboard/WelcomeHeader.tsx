import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Link } from "wouter";

export default function WelcomeHeader() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {isLoading ? "..." : user?.firstName || "User"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening across your social accounts today.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button className="btn flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none">
            <i className="ri-calendar-line mr-2"></i> <span className="hidden sm:inline">Analytics</span> Report
          </button>
          <Link href="/compose">
            <a className="btn flex items-center px-4 py-2 bg-primary text-white rounded-md shadow-sm text-sm font-medium hover:bg-secondary focus:outline-none">
              <i className="ri-add-line mr-2"></i> New Post
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
