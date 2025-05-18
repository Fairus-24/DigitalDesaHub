import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});
export const insertUserSchema = createInsertSchema(users).pick({ username: true, password: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});
export const insertCategorySchema = createInsertSchema(categories).pick({ name: true, slug: true });
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// UMKM Businesses table
// Extended to match storage fields: history, currentCondition, maps1, maps2, reviews, productImages
export const umkms = pgTable("umkms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  location: text("location").notNull(),
  address: text("address").notNull(),
  categoryId: integer("category_id").notNull(),
  promotionText: text("promotion_text"),
  coordinates: text("coordinates").notNull(),
  history: text("history").notNull(),
  currentCondition: text("current_condition").notNull(),
  maps1: text("maps1").notNull(),
  maps2: text("maps2").notNull(),
  reviews: text("reviews").notNull(),         // JSON serialized
  productImages: text("product_images").notNull(), // JSON serialized
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
  history: true,
  currentCondition: true,
  maps1: true,
  maps2: true,
  reviews: true,
  productImages: true,
});
export type InsertUmkm = z.infer<typeof insertUmkmSchema>;
export type Umkm = typeof umkms.$inferSelect;

// Village Profile table
// mission stored as JSON serialized text array
export const villageProfile = pgTable("village_profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  history: text("history").notNull(),
  vision: text("vision").notNull(),
  mission: text("mission").notNull(),        // JSON serialized
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
