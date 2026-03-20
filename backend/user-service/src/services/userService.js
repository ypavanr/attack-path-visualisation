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
    const { username, email, password, full_name, role } = userData;

    // Basic validation
    if (!username || !email || !password || !role) {
        throw new Error("Username, email, password, and role are required");
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

    // Create the user in Supabase
    const newUser = await userQueries.createUser(newUserData);

    // Make sure the role exists for this new user
    const roleObj = await userQueries.getOrCreateRole(role);

    // Link the user to the role
    await userQueries.linkUserRole(newUser.user_id, roleObj.role_id);

    // Return the newly created user without password but including their role string
    return { ...newUser, role: roleObj.role_name };
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
