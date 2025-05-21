import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { PlatformIcon, getPlatformDisplayName } from "@/components/ui/platform-icon";
import { PlatformType } from "@shared/schema";

// Analytics data structure from API
interface AnalyticsData {
  engagementRate: string;
  followerGrowth: number;
  growthTrend: string;
  platformBreakdown: Record<PlatformType, number>;
  platformData: Record<string, any[]>;
}

export default function AnalyticsOverview() {
  const [dateRange, setDateRange] = useState("30"); // days
  
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });
  
  // Generate mock data for chart visualizations
  const generateEngagementData = () => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    return days.map((day, i) => ({
      day,
      engagement: day === 'W' ? 32 : Math.floor(Math.random() * 30) + 10
    }));
  };
  
  const generateGrowthData = () => {
    return Array.from({ length: 10 }, (_, i) => ({
      day: i + 1,
      followers: 5000 + (i * 300) + Math.floor(Math.random() * 200)
    }));
  };
  
  const getPlatformBreakdownData = () => {
    if (!analytics) return [];
    
    return Object.entries(analytics.platformBreakdown)
      .map(([platform, value]) => ({
        platform: platform as PlatformType,
        value,
        label: getPlatformDisplayName(platform as PlatformType)
      }));
  };
  
  const getChartColors = () => {
    return {
      twitter: "#1DA1F2",
      instagram: "#E1306C",
      facebook: "#4267B2",
      bluesky: "#0063ff",
      bar: "hsl(var(--primary))",
      area: "hsl(var(--primary))"
    };
  };
  
  const engagementData = generateEngagementData();
  const growthData = generateGrowthData();
  const breakdownData = getPlatformBreakdownData();
  const chartColors = getChartColors();

  if (isLoading) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden p-5 animate-pulse"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="mt-4 h-36 bg-gray-100 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
        <div className="flex items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Last {dateRange} days</span>
          <button 
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 rounded-md"
            aria-label="Change date range"
          >
            <i className="ri-calendar-line"></i>
          </button>
          <button 
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 rounded-md"
            aria-label="Download report"
          >
            <i className="ri-download-line"></i>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Engagement Rate Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Engagement Rate</h3>
            <i className="ri-bar-chart-fill text-primary"></i>
          </div>
          <p className="text-3xl font-bold dark:text-white">{analytics?.engagementRate || "0%"}</p>
          <div className="flex items-center mt-1 text-green-600">
            <i className="ri-arrow-up-line mr-1"></i>
            <span>12% vs. last period</span>
          </div>
          <div className="mt-4 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Engagement']} 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} 
                />
                <Bar 
                  dataKey="engagement" 
                  name="Engagement" 
                  fill={chartColors.bar} 
                  radius={[4, 4, 0, 0]} 
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Follower Growth Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Follower Growth</h3>
            <i className="ri-user-add-line text-primary"></i>
          </div>
          <p className="text-3xl font-bold dark:text-white">+{analytics?.followerGrowth || 0}</p>
          <div className="flex items-center mt-1 text-red-500">
            <i className="ri-arrow-down-line mr-1"></i>
            <span>3% vs. last period</span>
          </div>
          <div className="mt-4 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.area} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={chartColors.area} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis 
                  domain={[0, 'dataMax + 1000']} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  formatter={(value) => [value, 'Followers']} 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="followers" 
                  name="Followers" 
                  stroke={chartColors.area} 
                  fillOpacity={1} 
                  fill="url(#growthGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Platform Breakdown Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Platform Breakdown</h3>
            <i className="ri-pie-chart-line text-primary"></i>
          </div>
          <div className="mt-4 h-36 flex items-center justify-center">
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie
                  data={breakdownData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  innerRadius={40}
                  paddingAngle={2}
                  label={false}
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[entry.platform]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Engagement']} 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="ml-4">
              {breakdownData.map((entry, index) => (
                <div key={index} className="flex items-center mb-1">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[entry.platform] }}></span>
                  <span className="ml-2 text-xs dark:text-gray-300">{entry.label}: {entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
