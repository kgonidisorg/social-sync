import { db } from './db';
import {
  users,
  connectedPlatforms,
  posts,
  postPlatforms,
  analytics,
  PlatformType
} from '@shared/schema';

async function main() {
  console.log('🌱 Seeding database...');

  // Check if we already have any users (to avoid duplicating seed data)
  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    console.log('Database already seeded with users, skipping...');
    return;
  }

  // Insert demo user
  const [demoUser] = await db.insert(users).values({
    username: "alex_morgan",
    password: "password123",
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex@socialsync.co",
    profileImage: "https://i.pravatar.cc/150?img=23"
  }).returning();

  console.log(`Created demo user: ${demoUser.firstName} ${demoUser.lastName}`);

  // Add connected platforms
  const platforms: PlatformType[] = ["twitter", "instagram", "facebook"];
  for (const platform of platforms) {
    await db.insert(connectedPlatforms).values({
      userId: demoUser.id,
      platform,
      connected: true,
      accessToken: "mock-token",
      refreshToken: "mock-refresh-token",
      platformUsername: `alex_morgan_${platform}`
    });
    console.log(`Connected platform: ${platform}`);
  }

  // Add some demo posts
  const [demoPost1] = await db.insert(posts).values({
    userId: demoUser.id,
    content: "Exciting news! Our new product line is launching next week. Stay tuned for updates.",
    status: "published",
    createdAt: new Date("2023-11-10T14:30:00Z"),
    scheduledTime: null,
    mediaUrl: null
  }).returning();

  // Add post platform data
  await db.insert(postPlatforms).values({
    postId: demoPost1.id,
    platform: "twitter",
    platformPostId: "12345",
    likes: 128,
    comments: 29,
    shares: 24,
    engagement: 181
  });

  const [demoPost2] = await db.insert(posts).values({
    userId: demoUser.id,
    content: "Behind the scenes at our latest photoshoot! #BTS #ComingSoon",
    status: "published",
    createdAt: new Date("2023-11-08T11:45:00Z"),
    scheduledTime: null,
    mediaUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500"
  }).returning();

  await db.insert(postPlatforms).values({
    postId: demoPost2.id,
    platform: "instagram",
    platformPostId: "67890",
    likes: 243,
    comments: 18,
    shares: 7,
    engagement: 268
  });

  const [demoPost3] = await db.insert(posts).values({
    userId: demoUser.id,
    content: "Thank you to everyone who attended our customer meetup yesterday! Great conversations and insights shared.",
    status: "published",
    createdAt: new Date("2023-11-06T09:15:00Z"),
    scheduledTime: null,
    mediaUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500"
  }).returning();

  await db.insert(postPlatforms).values({
    postId: demoPost3.id,
    platform: "facebook",
    platformPostId: "13579",
    likes: 87,
    comments: 14,
    shares: 9,
    engagement: 110
  });

  // Add scheduled posts
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(14, 30, 0, 0);

  const [scheduledPost1] = await db.insert(posts).values({
    userId: demoUser.id,
    content: "Our new product launch is coming next week! Stay tuned for exciting announcements. #ProductLaunch",
    status: "scheduled",
    createdAt: new Date(),
    scheduledTime: tomorrow,
    mediaUrl: null
  }).returning();

  await db.insert(postPlatforms).values({
    postId: scheduledPost1.id,
    platform: "twitter",
    platformPostId: null,
    likes: 0,
    comments: 0,
    shares: 0,
    engagement: 0
  });

  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  dayAfterTomorrow.setHours(16, 45, 0, 0);

  const [scheduledPost2] = await db.insert(posts).values({
    userId: demoUser.id,
    content: "Behind the scenes at our new photo shoot! #BTS #ComingSoon",
    status: "scheduled",
    createdAt: new Date(),
    scheduledTime: dayAfterTomorrow,
    mediaUrl: null
  }).returning();

  await db.insert(postPlatforms).values({
    postId: scheduledPost2.id,
    platform: "instagram",
    platformPostId: null,
    likes: 0,
    comments: 0,
    shares: 0,
    engagement: 0
  });

  // Add analytics data
  for (const platform of platforms) {
    await db.insert(analytics).values({
      userId: demoUser.id,
      platform,
      date: new Date(),
      engagementRate: platform === "twitter" ? "4.7%" : platform === "instagram" ? "3.9%" : "2.5%",
      followerCount: platform === "twitter" ? 8530 : platform === "instagram" ? 12450 : 5280,
      followersGained: platform === "twitter" ? 347 : platform === "instagram" ? 256 : 244,
      impressions: platform === "twitter" ? 28500 : platform === "instagram" ? 32400 : 18900,
      profileViews: platform === "twitter" ? 1240 : platform === "instagram" ? 2350 : 980
    });
    console.log(`Added analytics for ${platform}`);
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });