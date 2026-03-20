import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createProxyMiddleware } from "http-proxy-middleware";
import { verifyAdmin } from "./middleware/authMiddleware.js";

const app = express();

app.use(cors({
    origin: "http://localhost:4200", 
    credentials: true,
}));
app.use(cookieParser());
// Don't apply express.json() globally before the proxy, 
// as it can sometimes consume the body and break proxying for POST/PUT requests
// If needed for other gateway routes, apply it specifically to those.

app.get("/", (req, res) => {
  res.send("Gateway API running");
});

// Proxy /api/users to the User Service (Port 5001) - PROTECTED BY verifyAdmin
app.use("/api/users", verifyAdmin, (req, res, next) => {
  // Reconstruct original path for the proxy
  req.url = req.originalUrl;
  createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true,
  })(req, res, next);
});

// Proxy /api/auth to the Auth Service (Port 5002)
app.use("/api/auth", (req, res, next) => {
  req.url = req.originalUrl;
  createProxyMiddleware({
    target: "http://localhost:5002",
    changeOrigin: true,
  })(req, res, next);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});