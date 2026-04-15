export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  tokens: Tokens;
}

export interface UserProfile {
  username: string;
  email: string;
  bio: string;
  university_group: string;
  avatar_url: string;
}