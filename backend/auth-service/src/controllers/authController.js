import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as userQueries from "../queries/userQueries.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_in_production";

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Please provide email and password" });
        }

        const user = await userQueries.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const payload = {
            id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role || 'user' 
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict', 
            maxAge: 3600000 
        });

        const { password: userPassword, ...safeUser } = user;
                
        res.status(200).json({
            success: true,
            user: safeUser,
            message: "Logged in successfully" 
        });

    } catch (error) {
        console.error("Error in login:", error.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};
