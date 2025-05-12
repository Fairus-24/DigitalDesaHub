import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// UMKM Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// UMKM Businesses
export const umkms = pgTable("umkms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  location: text("location").notNull(),
  address: text("address").notNull(),
  categoryId: integer("category_id").notNull(),
  promotionText: text("promotion_text"),
  coordinates: text("coordinates").notNull(), // Format: "latitude,longitude"
});

export const insertUmkmSchema = createInsertSchema(umkms).pick({
  name: true,
  description: true,
  imageUrl: true,
  location: true,
  address: true,
  categoryId: true,
  promotionText: true,
  coordinates: true,
});

export type InsertUmkm = z.infer<typeof insertUmkmSchema>;
export type Umkm = typeof umkms.$inferSelect;

// Village Profile
export const villageProfile = pgTable("village_profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  history: text("history").notNull(),
  vision: text("vision").notNull(),
  mission: text("mission").notNull().array(),
  population: integer("population").notNull(),
  umkmCount: integer("umkm_count").notNull(),
  hamletCount: integer("hamlet_count").notNull(),
});

export const insertVillageProfileSchema = createInsertSchema(villageProfile).pick({
  name: true,
  description: true,
  history: true,
  vision: true,
  mission: true,
  population: true,
  umkmCount: true,
  hamletCount: true,
});

export type InsertVillageProfile = z.infer<typeof insertVillageProfileSchema>;
export type VillageProfile = typeof villageProfile.$inferSelect;
