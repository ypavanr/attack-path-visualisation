import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();

app.use(cors());
// Don't apply express.json() globally before the proxy, 
// as it can sometimes consume the body and break proxying for POST/PUT requests
// If needed for other gateway routes, apply it specifically to those.

app.get("/", (req, res) => {
  res.send("Gateway API running");
});

// Proxy /api/users to the User Service
app.use("/api/users", (req, res, next) => {
  // Reconstruct original path for the proxy
  req.url = req.originalUrl;
  createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true,
  })(req, res, next);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});