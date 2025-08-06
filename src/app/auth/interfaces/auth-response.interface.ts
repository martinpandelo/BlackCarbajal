import { User } from "./auth.interface";

export interface AuthResponse {
  user:  User;
  token: string;
}

