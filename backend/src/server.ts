import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import mongoose from "mongoose";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 3001;
const MONGO_URI = process.env.MONGO_URI as string;

// Enable CORS to allow communication from the frontend
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Authentication routes (public and protected)
app.use("/api/auth", authRoutes);

// User management routes (protected)
app.use("/api/users", userRoutes);

// Inventory routes
app.use("/api/inventory", inventoryRoutes);

// Order routes
app.use("/api/orders", orderRoutes);

// Connect to MongoDB
mongoose 
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error: any) => {
    console.error("Error connecting to MongoDB:", error);
  });

// A simple API endpoint
app.get('/api/message', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});