import * as userService from "../services/userService.js";

// @route   GET /api/users
// @desc    Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        // Don't send passwords back
        const safeUsers = users.map(u => {
            const { password, ...safeUser } = u;
            return safeUser;
        });
        res.status(200).json({ success: true, data: safeUsers });
    } catch (error) {
        console.error("Error in getAllUsers:", error.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

// @route   GET /api/users/:id
// @desc    Get a single user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        const { password, ...safeUser } = user;
        res.status(200).json({ success: true, data: safeUser });
    } catch (error) {
        console.error("Error in getUserById:", error.message);
        if (error.message === "User not found") {
            return res.status(404).json({ success: false, error: error.message });
        }
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

// @route   POST /api/users
// @desc    Create a new user
export const createUser = async (req, res) => {
    try {
        const newUser = await userService.createUser(req.body);
        const { password, ...safeUser } = newUser;
        res.status(201).json({ success: true, data: safeUser });
    } catch (error) {
        console.error("Error in createUser:", error.message);
        if (error.message.includes("already")) {
             return res.status(400).json({ success: false, error: error.message });
        }
        res.status(400).json({ success: false, error: error.message });
    }
};

// @route   PUT /api/users/:id
// @desc    Update a user
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        const { password, ...safeUser } = updatedUser;
        res.status(200).json({ success: true, data: safeUser });
    } catch (error) {
        console.error("Error in updateUser:", error.message);
        if (error.message === "User not found") {
            return res.status(404).json({ success: false, error: error.message });
        }
        res.status(400).json({ success: false, error: error.message });
    }
};

// @route   DELETE /api/users/:id
// @desc    Delete a user
export const deleteUser = async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error in deleteUser:", error.message);
        if (error.message === "User not found") {
            return res.status(404).json({ success: false, error: error.message });
        }
        res.status(500).json({ success: false, error: "Server Error" });
    }
};
