import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Basic health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", service: "user-service" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
