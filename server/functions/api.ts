import serverless from "serverless-http";
import express, { Request, Response, NextFunction } from "express";   // ← tambahkan NextFunction
import { registerRoutes } from "../routes";
import { serveStatic } from "../vite";
import { storage } from '../storage';
import { adminDb } from '../firebase-admin';

const app = express();
app.use(express.json());
registerRoutes(app);

// Endpoint untuk migrasi data ke Firestore
app.post('/migrate-to-firestore', async (req: Request, res: Response) => {
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

// Error handler dengan tipe yang eksplisit
app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Internal Server Error" });
  }
);

// Serve static build di production
if (process.env.NODE_ENV === "production") {
  serveStatic(app);
}

export const handler = serverless(app);
