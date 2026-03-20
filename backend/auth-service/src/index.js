import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors({
    origin: "http://localhost:4200", // Allow frontend or gateway depending on proxy setup
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", service: "auth-service" });
});

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});
