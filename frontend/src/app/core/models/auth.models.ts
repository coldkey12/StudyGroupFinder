export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password2: string;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterResponse {
  access: string;
  refresh: string;
}

export interface UserProfile {
  username: string;
  email: string;
  bio: string;
  university: string;
  major: string;
}
