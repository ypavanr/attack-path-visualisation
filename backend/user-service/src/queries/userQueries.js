import { supabase } from "../db/supabaseClient.js";

// Fetch all users
export const getAllUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return data;
};

// Fetch a single user by ID
export const getUserById = async (id) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", id)
    .single();
  
  // single() doesn't throw on no rows by default, it just returns null
  // actually in supabase-js v2, single() does throw an error PGE0xxx if no rows are found
  if (error) {
    if (error.code === 'PGRST116') {
        return null; // Not found
    }
    throw error;
  }
  return data;
};

// Fetch a single user by email (useful for login/validation)
export const getUserByEmail = async (email) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle(); // maybeSingle returns null if 0 rows, 1 row if 1 row, throws if >1 row
    
    if (error) throw error;
    return data;
};

// Fetch a single user by username
export const getUserByUsername = async (username) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .maybeSingle();
    
    if (error) throw error;
    return data;
};

// Create a new user
export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from("users")
    .insert([userData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Update an existing user
export const updateUser = async (id, userData) => {
  const { data, error } = await supabase
    .from("users")
    .update(userData)
    .eq("user_id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Delete a user
export const deleteUser = async (id) => {
  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("user_id", id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data; // Returns the deleted row, or null if it didn't exist
};
