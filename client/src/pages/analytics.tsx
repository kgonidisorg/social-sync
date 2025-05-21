import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { PlatformIcon, getPlatformDisplayName } from "@/components/ui/platform-icon";
import { PlatformType } from "@shared/schema";

export default function Analytics() {
  const [dateRange, setDateRange] = useState("30"); // days
  
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/analytics"],
  });
  
  // Mock data for charts
  const engagementData = [
    { name: "Mon", twitter: 24, instagram: 18, facebook: 12, bluesky: 5 },
    { name: "Tue", twitter: 20, instagram: 22, facebook: 10, bluesky: 4 },
    { name: "Wed", twitter: 32, instagram: 26, facebook: 15, bluesky: 8 },
    { name: "Thu", twitter: 25, instagram: 24, facebook: 12, bluesky: 6 },
    { name: "Fri", twitter: 22, instagram: 28, facebook: 14, bluesky: 5 },
    { name: "Sat", twitter: 18, instagram: 30, facebook: 16, bluesky: 4 },
    { name: "Sun", twitter: 21, instagram: 26, facebook: 13, bluesky: 6 },
  ];
  
  const followerGrowthData = [
    { date: "1", twitter: 5400, instagram: 8200, facebook: 3600, bluesky: 1200 },
    { date: "5", twitter: 5600, instagram: 8400, facebook: 3700, bluesky: 1300 },
    { date: "10", twitter: 5800, instagram: 8700, facebook: 3800, bluesky: 1400 },
    { date: "15", twitter: 6100, instagram: 9000, facebook: 3900, bluesky: 1500 },
    { date: "20", twitter: 6400, instagram: 9300, facebook: 4100, bluesky: 1600 },
    { date: "25", twitter: 6700, instagram: 9600, facebook: 4300, bluesky: 1700 },
    { date: "30", twitter: 7100, instagram: 10000, facebook: 4500, bluesky: 1800 },
  ];
  
  const impressionsData = [
    { date: "1", impressions: 5400 },
    { date: "5", impressions: 6200 },
    { date: "10", impressions: 7800 },
    { date: "15", impressions: 9500 },
    { date: "20", impressions: 8600 },
    { date: "25", impressions: 11200 },
    { date: "30", impressions: 12800 },
  ];
  
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
  
  const chartColors = getChartColors();
  
  const getBreakdownData = () => {
    if (!analytics) return [];
    
    return Object.entries(analytics.platformBreakdown || {})
      .map(([platform, value]) => ({
        platform: platform as PlatformType,
        value,
        label: getPlatformDisplayName(platform as PlatformType)
      }));
  };
  
  const breakdownData = getBreakdownData();

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track performance and engagement across your social platforms.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <select 
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 py-2 pl-3 pr-8"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
          </select>
          <button className="btn flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none">
            <i className="ri-download-line mr-2"></i> Export
          </button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Engagement</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">5,783</h3>
              <div className="flex items-center mt-1 text-green-600">
                <i className="ri-arrow-up-line mr-1"></i>
                <span className="text-xs">12.5% vs last period</span>
              </div>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 text-primary rounded-lg">
              <i className="ri-chat-1-line text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Followers</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">24,560</h3>
              <div className="flex items-center mt-1 text-green-600">
                <i className="ri-arrow-up-line mr-1"></i>
                <span className="text-xs">8.2% vs last period</span>
              </div>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 text-primary rounded-lg">
              <i className="ri-user-add-line text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Impressions</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">124.3K</h3>
              <div className="flex items-center mt-1 text-red-500">
                <i className="ri-arrow-down-line mr-1"></i>
                <span className="text-xs">3.1% vs last period</span>
              </div>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 text-primary rounded-lg">
              <i className="ri-eye-line text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Engagement</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">4.7%</h3>
              <div className="flex items-center mt-1 text-green-600">
                <i className="ri-arrow-up-line mr-1"></i>
                <span className="text-xs">0.8% vs last period</span>
              </div>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 text-primary rounded-lg">
              <i className="ri-pie-chart-line text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b dark:border-gray-700">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Engagement by Platform</h3>
          </div>
          <div className="p-5">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))' 
                    }}
                  />
                  <Legend />
                  <Bar dataKey="twitter" name="Twitter/X" fill={chartColors.twitter} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="instagram" name="Instagram" fill={chartColors.instagram} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="facebook" name="Facebook" fill={chartColors.facebook} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="bluesky" name="Bluesky" fill={chartColors.bluesky} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b dark:border-gray-700">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Follower Growth</h3>
          </div>
          <div className="p-5">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={followerGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                  <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))' 
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="twitter" name="Twitter/X" stroke={chartColors.twitter} strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="instagram" name="Instagram" stroke={chartColors.instagram} strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="facebook" name="Facebook" stroke={chartColors.facebook} strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="bluesky" name="Bluesky" stroke={chartColors.bluesky} strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b dark:border-gray-700">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Platform Breakdown</h3>
          </div>
          <div className="p-5">
            <div className="h-60 flex items-center justify-center">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={breakdownData}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    paddingAngle={3}
                    label={false}
                  >
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[entry.platform]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Engagement']} 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="ml-4">
                {breakdownData.map((entry, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: chartColors[entry.platform] }}></span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{entry.label}: {entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b dark:border-gray-700">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Total Impressions</h3>
          </div>
          <div className="p-5">
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={impressionsData}>
                  <defs>
                    <linearGradient id="impressionsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartColors.area} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={chartColors.area} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                  <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                    tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
                  />
                  <Tooltip 
                    formatter={(value: any) => [value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value, 'Impressions']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))' 
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="impressions" 
                    name="Impressions" 
                    stroke={chartColors.area} 
                    fill="url(#impressionsGradient)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b dark:border-gray-700">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Top Performing Content</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="p-4 flex items-start">
              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                  <i className="ri-image-line"></i>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                  Exciting news! Our new product line is launching next week. Stay tuned for updates.
                </p>
                <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <PlatformIcon platform="twitter" size={12} className="mr-1" />
                  <span>Twitter/X</span>
                  <span className="mx-2">•</span>
                  <span>128 likes</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 flex items-start">
              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50" alt="Product photo" className="h-full w-full object-cover" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                  Behind the scenes at our latest photoshoot! #BTS #ComingSoon
                </p>
                <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <PlatformIcon platform="instagram" size={12} className="mr-1" />
                  <span>Instagram</span>
                  <span className="mx-2">•</span>
                  <span>243 likes</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 flex items-start">
              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50" alt="Company event" className="h-full w-full object-cover" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                  Thank you to everyone who attended our customer meetup yesterday! Great conversations and insights shared.
                </p>
                <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <PlatformIcon platform="facebook" size={12} className="mr-1" />
                  <span>Facebook</span>
                  <span className="mx-2">•</span>
                  <span>87 likes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Best Time to Post */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="p-5 border-b dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Best Time to Post</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <PlatformIcon platform="twitter" size={18} className="mr-2" />
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Twitter/X</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Monday - Friday</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">8 AM - 10 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Weekend</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">11 AM - 1 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Best day</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Wednesday</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <PlatformIcon platform="instagram" size={18} className="mr-2" />
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Instagram</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Monday - Friday</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">11 AM - 1 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Weekend</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">10 AM - 2 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Best day</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Saturday</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <PlatformIcon platform="facebook" size={18} className="mr-2" />
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Facebook</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Monday - Friday</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">1 PM - 4 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Weekend</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">12 PM - 1 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Best day</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Friday</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <PlatformIcon platform="bluesky" size={18} className="mr-2" />
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Bluesky</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Monday - Friday</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">6 PM - 9 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Weekend</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">2 PM - 5 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Best day</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Sunday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
