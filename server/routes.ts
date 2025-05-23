import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPostSchema, insertPostPlatformSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/user", async (req: Request, res: Response) => {
    // For demo purposes, return the first user (Alex Morgan)
    const user = await storage.getUser(1);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.get("/api/platforms", async (req: Request, res: Response) => {
    // For demo purposes, use userId = 1
    const platforms = await storage.getPlatformsByUserId(1);
    res.json(platforms);
  });

  app.get("/api/posts", async (req: Request, res: Response) => {
    // For demo purposes, use userId = 1
    const userId = 1;
    const posts = await storage.getPostsByUserId(userId);
    
    // Augment posts with platform data
    const postsWithPlatforms = await Promise.all(posts.map(async (post) => {
      const platforms = await storage.getPostPlatforms(post.id);
      return {
        ...post,
        platforms
      };
    }));
    
    res.json(postsWithPlatforms);
  });

  app.get("/api/posts/scheduled", async (req: Request, res: Response) => {
    // For demo purposes, use userId = 1
    const userId = 1;
    const scheduledPosts = await storage.getScheduledPosts(userId);
    
    // Augment posts with platform data
    const postsWithPlatforms = await Promise.all(scheduledPosts.map(async (post) => {
      const platforms = await storage.getPostPlatforms(post.id);
      return {
        ...post,
        platforms
      };
    }));
    
    res.json(postsWithPlatforms);
  });

  app.post("/api/posts", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const postData = insertPostSchema.parse({
        ...req.body,
        userId: 1, // For demo purposes, use userId = 1
      });

      // If in DEMO mode, don't post to database
      if (process.env.DEMO === "true") {
        return res.status(201).json({
          ...postData,
          id: Math.floor(Math.random() * 1000000),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      
      const newPost = await storage.createPost(postData);
      
      // Add platforms
      if (req.body.platforms && Array.isArray(req.body.platforms)) {
        await Promise.all(req.body.platforms.map((platform: string) => {
          const postPlatformData = insertPostPlatformSchema.parse({
            postId: newPost.id,
            platform,
            likes: 0,
            comments: 0,
            shares: 0,
            engagement: 0
          });
          
          return storage.addPostPlatform(postPlatformData);
        }));
      }
      
      res.status(201).json(newPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.delete("/api/posts/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    if (process.env.DEMO === "true") {
      return res.status(200).json({ message: "Post deleted" });
    }
    
    const deleted = await storage.deletePost(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    res.status(200).json({ message: "Post deleted" });
  });

  app.get("/api/analytics", async (req: Request, res: Response) => {
    // For demo purposes, use userId = 1
    const userId = 1;
    const analytics = await storage.getUserAnalytics(userId);
    
    // Group analytics by platform
    const platformData = analytics.reduce((acc, item) => {
      if (!acc[item.platform]) {
        acc[item.platform] = [];
      }
      acc[item.platform].push(item);
      return acc;
    }, {} as Record<string, typeof analytics>);
    
    res.json({
      engagementRate: "4.7%",
      followerGrowth: 847,
      growthTrend: "+12%",
      platformBreakdown: {
        twitter: 30,
        instagram: 25,
        facebook: 20,
        bluesky: 5
      },
      platformData
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
