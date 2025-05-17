import serverless from "serverless-http";
import express, { Request, Response, NextFunction } from "express";   // ← tambahkan NextFunction
import { registerRoutes } from "../routes";
import { serveStatic } from "../vite";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});
registerRoutes(app);

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
