import { 
  User, InsertUser,
  ConnectedPlatform, InsertConnectedPlatform,
  Post, InsertPost,
  PostPlatform, InsertPostPlatform,
  Analytics, InsertAnalytics,
  PlatformType,
  users, connectedPlatforms, posts, postPlatforms, analytics
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, isNull } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Connected platforms methods
  async getPlatformsByUserId(userId: number): Promise<ConnectedPlatform[]> {
    return db.select().from(connectedPlatforms).where(eq(connectedPlatforms.userId, userId));
  }

  async connectPlatform(platform: InsertConnectedPlatform): Promise<ConnectedPlatform> {
    // Check if platform already exists for this user
    const [existingPlatform] = await db.select()
      .from(connectedPlatforms)
      .where(
        and(
          eq(connectedPlatforms.userId, platform.userId),
          eq(connectedPlatforms.platform, platform.platform)
        )
      );

    if (existingPlatform) {
      // Update the existing platform
      const [updatedPlatform] = await db.update(connectedPlatforms)
        .set({
          connected: platform.connected,
          accessToken: platform.accessToken,
          refreshToken: platform.refreshToken,
          platformUsername: platform.platformUsername
        })
        .where(eq(connectedPlatforms.id, existingPlatform.id))
        .returning();
      return updatedPlatform;
    } else {
      // Insert a new platform
      const [newPlatform] = await db
        .insert(connectedPlatforms)
        .values(platform)
        .returning();
      return newPlatform;
    }
  }

  async disconnectPlatform(userId: number, platform: PlatformType): Promise<boolean> {
    const result = await db.update(connectedPlatforms)
      .set({ connected: false })
      .where(
        and(
          eq(connectedPlatforms.userId, userId),
          eq(connectedPlatforms.platform, platform)
        )
      );
    
    return !!result;
  }

  // Posts methods
  async getPostsByUserId(userId: number): Promise<Post[]> {
    return db.select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt));
  }

  async getPostById(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db
      .insert(posts)
      .values({
        ...post,
        createdAt: new Date()
      })
      .returning();
    return newPost;
  }

  async updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined> {
    const [updatedPost] = await db.update(posts)
      .set(post)
      .where(eq(posts.id, id))
      .returning();
    return updatedPost || undefined;
  }

  async deletePost(id: number): Promise<boolean> {
    // First delete dependent records in post_platforms
    await db.delete(postPlatforms).where(eq(postPlatforms.postId, id));
    
    // Then delete the post
    const result = await db.delete(posts).where(eq(posts.id, id));
    
    return !!result;
  }

  async getScheduledPosts(userId: number): Promise<Post[]> {
    return db.select()
      .from(posts)
      .where(
        and(
          eq(posts.userId, userId),
          eq(posts.status, "scheduled")
        )
      )
      .orderBy(posts.scheduledTime);
  }

  // Post platforms methods
  async getPostPlatforms(postId: number): Promise<PostPlatform[]> {
    return db.select()
      .from(postPlatforms)
      .where(eq(postPlatforms.postId, postId));
  }

  async addPostPlatform(postPlatform: InsertPostPlatform): Promise<PostPlatform> {
    const [newPostPlatform] = await db
      .insert(postPlatforms)
      .values(postPlatform)
      .returning();
    return newPostPlatform;
  }

  // Analytics methods
  async getUserAnalytics(userId: number): Promise<Analytics[]> {
    return db.select()
      .from(analytics)
      .where(eq(analytics.userId, userId));
  }

  async addAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [newAnalytics] = await db
      .insert(analytics)
      .values(analyticsData)
      .returning();
    return newAnalytics;
  }
}