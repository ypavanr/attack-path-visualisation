export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserAuthData {
  id: string; 
  username: string;
  email: string;
  full_name?: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user?: UserAuthData; 
  message?: string;
  expiresIn?: number; 
}

export interface RegisterRequest {
  adminemail?: string;
  adminpassword?: string;
  full_name: string;
  username: string;
  email: string;
  assignedpassword?: string;
  password?: string; 
  role: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  user?: UserAuthData;
}
