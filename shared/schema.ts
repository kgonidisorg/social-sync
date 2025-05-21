import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  profileImage: text("profile_image"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  profileImage: true,
});

// SocialPlatform enum
export const platformEnum = z.enum(["twitter", "instagram", "facebook", "bluesky"]);
export type PlatformType = z.infer<typeof platformEnum>;

// Connected platforms schema
export const connectedPlatforms = pgTable("connected_platforms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  platform: text("platform", { enum: ["twitter", "instagram", "facebook", "bluesky"] }).notNull(),
  connected: boolean("connected").default(false),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  platformUsername: text("platform_username"),
});

export const insertConnectedPlatformSchema = createInsertSchema(connectedPlatforms).pick({
  userId: true,
  platform: true,
  connected: true,
  accessToken: true,
  refreshToken: true,
  platformUsername: true,
});

// Post schema
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  mediaUrl: text("media_url"),
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status", { enum: ["draft", "scheduled", "published"] }).default("draft"),
  scheduledTime: timestamp("scheduled_time"),
});

export const insertPostSchema = createInsertSchema(posts).pick({
  userId: true,
  content: true,
  mediaUrl: true,
  status: true,
  scheduledTime: true,
});

// Post platforms schema (for tracking which platforms a post is published to)
export const postPlatforms = pgTable("post_platforms", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  platform: text("platform", { enum: ["twitter", "instagram", "facebook", "bluesky"] }).notNull(),
  platformPostId: text("platform_post_id"),
  engagement: integer("engagement").default(0),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
});

export const insertPostPlatformSchema = createInsertSchema(postPlatforms).pick({
  postId: true,
  platform: true,
  platformPostId: true,
  engagement: true,
  likes: true,
  comments: true,
  shares: true,
});

// Analytics schema
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  platform: text("platform", { enum: ["twitter", "instagram", "facebook", "bluesky"] }).notNull(),
  date: timestamp("date").defaultNow(),
  engagementRate: text("engagement_rate"),
  followerCount: integer("follower_count"),
  followersGained: integer("followers_gained"),
  impressions: integer("impressions"),
  profileViews: integer("profile_views"),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).pick({
  userId: true,
  platform: true,
  date: true,
  engagementRate: true,
  followerCount: true,
  followersGained: true,
  impressions: true,
  profileViews: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ConnectedPlatform = typeof connectedPlatforms.$inferSelect;
export type InsertConnectedPlatform = z.infer<typeof insertConnectedPlatformSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type PostPlatform = typeof postPlatforms.$inferSelect;
export type InsertPostPlatform = z.infer<typeof insertPostPlatformSchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
