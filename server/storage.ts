import { 
  User, InsertUser,
  ConnectedPlatform, InsertConnectedPlatform,
  Post, InsertPost,
  PostPlatform, InsertPostPlatform,
  Analytics, InsertAnalytics,
  PlatformType
} from "@shared/schema";
import { DatabaseStorage } from "./database-storage";

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

// Use database storage
export const storage = new DatabaseStorage();
