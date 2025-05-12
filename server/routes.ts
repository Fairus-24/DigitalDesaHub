import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Get categories
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });
  
  // Get category by ID
  app.get('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
      
      const category = await storage.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch category' });
    }
  });
  
  // Get all UMKMs
  app.get('/api/umkms', async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : null;
      
      let umkms;
      if (categoryId && !isNaN(categoryId)) {
        umkms = await storage.getUmkmsByCategoryId(categoryId);
      } else {
        umkms = await storage.getUmkms();
      }
      
      res.json(umkms);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch UMKMs' });
    }
  });
  
  // Get UMKM by ID
  app.get('/api/umkms/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid UMKM ID' });
      }
      
      const umkm = await storage.getUmkmById(id);
      if (!umkm) {
        return res.status(404).json({ message: 'UMKM not found' });
      }
      
      res.json(umkm);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch UMKM' });
    }
  });
  
  // Get village profile
  app.get('/api/village-profile', async (req, res) => {
    try {
      const profile = await storage.getVillageProfile();
      if (!profile) {
        return res.status(404).json({ message: 'Village profile not found' });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch village profile' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
