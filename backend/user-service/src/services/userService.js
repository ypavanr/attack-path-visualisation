import bcrypt from "bcrypt";
import * as userQueries from "../queries/userQueries.js";

const SALT_ROUNDS = 10;

export const getAllUsers = async () => {
    return await userQueries.getAllUsers();
};

export const getUserById = async (id) => {
    const user = await userQueries.getUserById(id);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};

export const createUser = async (userData) => {
    const { username, email, password, full_name } = userData;

    // Basic validation
    if (!username || !email || !password) {
        throw new Error("Username, email, and password are required");
    }

    // Check if user already exists
    const existingEmail = await userQueries.getUserByEmail(email);
    if (existingEmail) {
        throw new Error("Email already in use");
    }

    const existingUsername = await userQueries.getUserByUsername(username);
    if (existingUsername) {
        throw new Error("Username already taken");
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUserData = {
        username,
        email,
        password: hashedPassword,
        full_name
    };

    return await userQueries.createUser(newUserData);
};

export const updateUser = async (id, userData) => {
    const { username, email, full_name, password } = userData;

    // Verify user exists first
    const existingUser = await userQueries.getUserById(id);
    if (!existingUser) {
        throw new Error("User not found");
    }

    const updates = {};
    if (username) {
        // Check if username is taken by ANOTHER user
        const userByUsername = await userQueries.getUserByUsername(username);
        if (userByUsername && userByUsername.user_id !== parseInt(id)) {
             throw new Error("Username already taken");
        }
        updates.username = username;
    }
    
    if (email) {
        // Check if email is taken by ANOTHER user
        const userByEmail = await userQueries.getUserByEmail(email);
        if (userByEmail && userByEmail.user_id !== parseInt(id)) {
            throw new Error("Email already in use");
       }
       updates.email = email;
    }

    if (full_name !== undefined) updates.full_name = full_name;
    
    if (password) {
        updates.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    if (Object.keys(updates).length === 0) {
        return existingUser; // No changes requested
    }

    return await userQueries.updateUser(id, updates);
};

export const deleteUser = async (id) => {
    const user = await userQueries.getUserById(id);
    if (!user) {
        throw new Error("User not found");
    }
    return await userQueries.deleteUser(id);
};
