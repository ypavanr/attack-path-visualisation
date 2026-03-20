import { supabase } from "../db/supabaseClient.js";

// Fetch a single user by email 
export const getUserByEmail = async (email) => {
    const { data, error } = await supabase
      .from("users")
      .select(`
        *,
        user_roles (
          roles (
            role_name
          )
        )
      `)
      .eq("email", email)
      .maybeSingle(); 
    
    if (error) throw error;
    
    // Flatten the role structure for the auth controller
    if (data) {
       if (data.user_roles && data.user_roles.length > 0 && data.user_roles[0].roles) {
           data.role = data.user_roles[0].roles.role_name;
       }
       // remove the nested object to keep the payload clean
       delete data.user_roles;
    }
    
    return data;
};

