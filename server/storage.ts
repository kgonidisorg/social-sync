import { 
  User, InsertUser, users,
  ConnectedPlatform, InsertConnectedPlatform, connectedPlatforms,
  Post, InsertPost, posts,
  PostPlatform, InsertPostPlatform, postPlatforms,
  Analytics, InsertAnalytics, analytics,
  PlatformType
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Connected platforms methods
  getPlatformsByUserId(userId: number): Promise<ConnectedPlatform[]>;
  connectPlatform(platform: InsertConnectedPlatform): Promise<ConnectedPlatform>;
  disconnectPlatform(userId: number, platform: PlatformType): Promise<boolean>;

  // Posts methods
  getPostsByUserId(userId: number): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  getScheduledPosts(userId: number): Promise<Post[]>;
  
  // Post platforms methods
  getPostPlatforms(postId: number): Promise<PostPlatform[]>;
  addPostPlatform(postPlatform: InsertPostPlatform): Promise<PostPlatform>;
  
  // Analytics methods
  getUserAnalytics(userId: number): Promise<Analytics[]>;
  addAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private connectedPlatforms: Map<number, ConnectedPlatform>;
  private posts: Map<number, Post>;
  private postPlatforms: Map<number, PostPlatform>;
  private analyticsData: Map<number, Analytics>;
  
  currentUserId: number;
  currentPlatformId: number;
  currentPostId: number;
  currentPostPlatformId: number;
  currentAnalyticsId: number;

  constructor() {
    this.users = new Map();
    this.connectedPlatforms = new Map();
    this.posts = new Map();
    this.postPlatforms = new Map();
    this.analyticsData = new Map();
    
    this.currentUserId = 1;
    this.currentPlatformId = 1;
    this.currentPostId = 1;
    this.currentPostPlatformId = 1;
    this.currentAnalyticsId = 1;
    
    // Seed with a demo user
    this.seedData();
  }

  private seedData() {
    // Create a demo user
    const demoUser: User = {
      id: this.currentUserId++,
      username: "alex_morgan",
      password: "password123",
      firstName: "Alex",
      lastName: "Morgan",
      email: "alex@socialsync.co",
      profileImage: "https://i.pravatar.cc/150?img=23"
    };
    this.users.set(demoUser.id, demoUser);
    
    // Add connected platforms
    const platforms: PlatformType[] = ["twitter", "instagram", "facebook"];
    platforms.forEach(platform => {
      const connectedPlatform: ConnectedPlatform = {
        id: this.currentPlatformId++,
        userId: demoUser.id,
        platform,
        connected: true,
        accessToken: "mock-token",
        refreshToken: "mock-refresh-token",
        platformUsername: `alex_morgan_${platform}`
      };
      this.connectedPlatforms.set(connectedPlatform.id, connectedPlatform);
    });
    
    // Add some demo posts
    const demoPost1: Post = {
      id: this.currentPostId++,
      userId: demoUser.id,
      content: "Exciting news! Our new product line is launching next week. Stay tuned for updates.",
      status: "published",
      createdAt: new Date("2023-11-10T14:30:00Z"),
      scheduledTime: null,
      mediaUrl: null
    };
    this.posts.set(demoPost1.id, demoPost1);
    
    // Add post platform data
    this.addPostPlatform({
      postId: demoPost1.id,
      platform: "twitter",
      platformPostId: "12345",
      likes: 128,
      comments: 29,
      shares: 24,
      engagement: 181
    });
    
    const demoPost2: Post = {
      id: this.currentPostId++,
      userId: demoUser.id,
      content: "Behind the scenes at our latest photoshoot! #BTS #ComingSoon",
      status: "published",
      createdAt: new Date("2023-11-08T11:45:00Z"),
      scheduledTime: null,
      mediaUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500"
    };
    this.posts.set(demoPost2.id, demoPost2);
    
    this.addPostPlatform({
      postId: demoPost2.id,
      platform: "instagram",
      platformPostId: "67890",
      likes: 243,
      comments: 18,
      shares: 7,
      engagement: 268
    });
    
    const demoPost3: Post = {
      id: this.currentPostId++,
      userId: demoUser.id,
      content: "Thank you to everyone who attended our customer meetup yesterday! Great conversations and insights shared.",
      status: "published",
      createdAt: new Date("2023-11-06T09:15:00Z"),
      scheduledTime: null,
      mediaUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500"
    };
    this.posts.set(demoPost3.id, demoPost3);
    
    this.addPostPlatform({
      postId: demoPost3.id,
      platform: "facebook",
      platformPostId: "13579",
      likes: 87,
      comments: 14,
      shares: 9,
      engagement: 110
    });
    
    // Add scheduled posts
    const scheduledPost1: Post = {
      id: this.currentPostId++,
      userId: demoUser.id,
      content: "Our new product launch is coming next week! Stay tuned for exciting announcements. #ProductLaunch",
      status: "scheduled",
      createdAt: new Date(),
      scheduledTime: new Date(new Date().setHours(14, 30, 0, 0)),
      mediaUrl: null
    };
    this.posts.set(scheduledPost1.id, scheduledPost1);
    
    this.addPostPlatform({
      postId: scheduledPost1.id,
      platform: "twitter",
      platformPostId: null,
      likes: 0,
      comments: 0,
      shares: 0,
      engagement: 0
    });
    
    const scheduledPost2: Post = {
      id: this.currentPostId++,
      userId: demoUser.id,
      content: "Behind the scenes at our new photo shoot! #BTS #ComingSoon",
      status: "scheduled",
      createdAt: new Date(),
      scheduledTime: new Date(new Date().setHours(16, 45, 0, 0)),
      mediaUrl: null
    };
    this.posts.set(scheduledPost2.id, scheduledPost2);
    
    this.addPostPlatform({
      postId: scheduledPost2.id,
      platform: "instagram",
      platformPostId: null,
      likes: 0,
      comments: 0,
      shares: 0,
      engagement: 0
    });
    
    // Add analytics data
    platforms.forEach(platform => {
      const analytics: Analytics = {
        id: this.currentAnalyticsId++,
        userId: demoUser.id,
        platform,
        date: new Date(),
        engagementRate: platform === "twitter" ? "4.7%" : platform === "instagram" ? "3.9%" : "2.5%",
        followerCount: platform === "twitter" ? 8530 : platform === "instagram" ? 12450 : 5280,
        followersGained: platform === "twitter" ? 347 : platform === "instagram" ? 256 : 244,
        impressions: platform === "twitter" ? 28500 : platform === "instagram" ? 32400 : 18900,
        profileViews: platform === "twitter" ? 1240 : platform === "instagram" ? 2350 : 980
      };
      this.analyticsData.set(analytics.id, analytics);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Connected platforms methods
  async getPlatformsByUserId(userId: number): Promise<ConnectedPlatform[]> {
    return Array.from(this.connectedPlatforms.values()).filter(
      platform => platform.userId === userId
    );
  }

  async connectPlatform(platform: InsertConnectedPlatform): Promise<ConnectedPlatform> {
    const id = this.currentPlatformId++;
    const connectedPlatform: ConnectedPlatform = { ...platform, id };
    this.connectedPlatforms.set(id, connectedPlatform);
    return connectedPlatform;
  }

  async disconnectPlatform(userId: number, platform: PlatformType): Promise<boolean> {
    const platformToDisconnect = Array.from(this.connectedPlatforms.values()).find(
      p => p.userId === userId && p.platform === platform
    );
    
    if (platformToDisconnect) {
      platformToDisconnect.connected = false;
      this.connectedPlatforms.set(platformToDisconnect.id, platformToDisconnect);
      return true;
    }
    
    return false;
  }

  // Posts methods
  async getPostsByUserId(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPostById(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(post: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const newPost: Post = { 
      ...post, 
      id, 
      createdAt: new Date() 
    };
    this.posts.set(id, newPost);
    return newPost;
  }

  async updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined> {
    const existingPost = this.posts.get(id);
    
    if (!existingPost) {
      return undefined;
    }
    
    const updatedPost: Post = {
      ...existingPost,
      ...post
    };
    
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }

  async getScheduledPosts(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.userId === userId && post.status === "scheduled")
      .sort((a, b) => {
        if (!a.scheduledTime || !b.scheduledTime) return 0;
        return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
      });
  }

  // Post platforms methods
  async getPostPlatforms(postId: number): Promise<PostPlatform[]> {
    return Array.from(this.postPlatforms.values()).filter(
      pp => pp.postId === postId
    );
  }

  async addPostPlatform(postPlatform: InsertPostPlatform): Promise<PostPlatform> {
    const id = this.currentPostPlatformId++;
    const newPostPlatform: PostPlatform = { ...postPlatform, id };
    this.postPlatforms.set(id, newPostPlatform);
    return newPostPlatform;
  }

  // Analytics methods
  async getUserAnalytics(userId: number): Promise<Analytics[]> {
    return Array.from(this.analyticsData.values()).filter(
      a => a.userId === userId
    );
  }

  async addAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const id = this.currentAnalyticsId++;
    const newAnalytics: Analytics = { ...analyticsData, id };
    this.analyticsData.set(id, newAnalytics);
    return newAnalytics;
  }
}

export const storage = new MemStorage();
