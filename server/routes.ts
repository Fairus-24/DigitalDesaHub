import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { adminDb } from './firebase-admin';

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes

  // CRUD for categories
  app.post('/api/categories', async (req, res) => {
    try {
      const category = await storage.createCategory(req.body);
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create category' });
    }
  });

  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  app.put('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
      const category = await storage.updateCategory(id, req.body);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update category' });
    }
  });

  app.delete('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
      await storage.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete category' });
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

  // CRUD for UMKMs
  app.post('/api/umkms', async (req, res) => {
    try {
      const umkm = await storage.createUmkm(req.body);
      res.json(umkm);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create UMKM' });
    }
  });

  app.put('/api/umkms/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid UMKM ID' });
      }
      const umkm = await storage.updateUmkm(id, req.body);
      if (!umkm) {
        return res.status(404).json({ message: 'UMKM not found' });
      }
      res.json(umkm);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update UMKM' });
    }
  });

  app.delete('/api/umkms/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid UMKM ID' });
      }
      await storage.deleteUmkm(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete UMKM' });
    }
  });

  app.get('/api/umkms', async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : null;
      let umkms;
      if (categoryId && !isNaN(categoryId)) {
        umkms = await storage.getUmkmsByCategoryId(categoryId);
      } else {
        umkms = await storage.getUmkms();
      }
      // Pastikan setiap productImages dan reviews di array selalu array
      const safeUmkms = umkms.map((umkm: any) => {
        let productImages: string[] = [];
        if (typeof umkm.productImages === 'string') {
          try {
            const parsed = JSON.parse(umkm.productImages);
            productImages = Array.isArray(parsed) ? parsed : [];
          } catch {
            productImages = [];
          }
        } else if (Array.isArray(umkm.productImages)) {
          productImages = umkm.productImages;
        }
        let reviews: any[] = [];
        if (typeof umkm.reviews === 'string') {
          try {
            const parsed = JSON.parse(umkm.reviews);
            reviews = Array.isArray(parsed) ? parsed : [];
          } catch {
            reviews = [];
          }
        } else if (Array.isArray(umkm.reviews)) {
          reviews = umkm.reviews;
        }
        return { ...umkm, productImages, reviews };
      });
      res.json(safeUmkms);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch UMKMs' });
    }
  });

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
      // Pastikan productImages dan reviews selalu array
      let productImages: string[] = [];
      if (typeof umkm.productImages === 'string') {
        try {
          const parsed = JSON.parse(umkm.productImages);
          productImages = Array.isArray(parsed) ? parsed : [];
        } catch {
          productImages = [];
        }
      } else if (Array.isArray(umkm.productImages)) {
        productImages = umkm.productImages;
      }
      let reviews: any[] = [];
      if (typeof umkm.reviews === 'string') {
        try {
          const parsed = JSON.parse(umkm.reviews);
          reviews = Array.isArray(parsed) ? parsed : [];
        } catch {
          reviews = [];
        }
      } else if (Array.isArray(umkm.reviews)) {
        reviews = umkm.reviews;
      }
      res.json({ ...umkm, productImages, reviews });
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
      // Pastikan mission di response selalu array
      let missionResponse: string[] = [];
      if (typeof profile.mission === 'string') {
        try {
          const parsed = JSON.parse(profile.mission);
          missionResponse = Array.isArray(parsed) ? parsed : [];
        } catch {
          missionResponse = [];
        }
      } else if (Array.isArray(profile.mission)) {
        missionResponse = profile.mission;
      }
      res.json({ ...profile, mission: missionResponse });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch village profile' });
    }
  });

  // ENDPOINT MIGRASI DATA STORAGE -> FIRESTORE
  app.post('/api/migrate-to-firestore', async (req, res) => {
    try {
      // Migrasi kategori
      const categories = await storage.getCategories();
      for (const cat of categories) {
        await adminDb.collection('kategori').doc(String(cat.id)).set(cat);
      }
      // Migrasi UMKM
      const umkms = await storage.getUmkms();
      for (const umkm of umkms) {
        await adminDb.collection('umkm').doc(String(umkm.id)).set(umkm);
      }
      res.json({ success: true, message: 'Migrasi data ke Firestore berhasil!' });
    } catch (err) {
      res.status(500).json({ success: false, error: err?.toString() });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}