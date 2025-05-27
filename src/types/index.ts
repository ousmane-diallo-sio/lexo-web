export interface User {
  id: string;
  email: string;
  username: string;
  birthdate?: Date;
  emailVerified: boolean;
  isAdmin: boolean;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  username: string;
  password?: string;
  birthdate?: Date;
}

export interface CreateUserGoogleDTO {
  email: string;
  username: string;
  googleId: string;
  birthdate?: Date;
}

export interface CreateAdminUserDTO extends CreateUserDTO {
  isAdmin: boolean;
  adminCreationKey: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

export interface ServerMessage {
  type: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
}

export interface ServerResponse<T = undefined> {
  status: number;
  data?: T;
  messages?: ServerMessage[];
  code?: string;
  jwt?: string;
} 