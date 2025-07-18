import React from 'react';

// Base Entity
export interface BaseEntity {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// User Entity (updated to match API)
export interface User extends BaseEntity {
  email: string;
  password?: string;
  googleId?: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  children?: ChildUser[];
  // Keep legacy fields for backward compatibility
  username?: string;
  birthdate?: Date;
  emailVerified?: boolean;
}

// Child User Entity
export interface ChildUser extends BaseEntity {
  firstName: string;
  username: string;
  birthdate: Date;
  xp: number;
  gems: number;
  avatarUrl: string;
  parent: string; // Parent user ID
  // Legacy fields for backward compatibility
  parentUserId?: string;
  lastName?: string;
  birthDate?: Date;
  avatar?: string;
  currentLevel?: number;
  availableExercises?: Exercise[];
}

// Age Range
export interface AgeRange {
  min: number; // 0-18
  max: number; // 0-18
}

// Exercise Base Entity
export interface Exercise extends BaseEntity {
  title: string;
  description: string;
  durationMinutes: number;
  mainColor: string;
  thumbnailUrl: string;
  xp: number;
  ageRange: AgeRange;
  difficulty: 'easy' | 'medium' | 'hard';
  exerciseType: 'letter' | 'animal' | 'number' | 'color';
  user?: User;
  availableToChildren?: ChildUser[];
}

// Letter Exercise
export interface LetterExercise extends Exercise {
  exerciseType: 'letter';
  letter: string;
  word: string;
  wordImageUrl: string;
  // Legacy field for backward compatibility
  letters?: string[];
}

// Animal Exercise
export interface AnimalExercise extends Exercise {
  exerciseType: 'animal';
  animalName: string;
  animalImageUrl: string;
  animalSoundUrl: string;
  // Legacy field for backward compatibility
  animals?: string[];
}

// Number Exercise
export interface NumberExercise extends Exercise {
  exerciseType: 'number';
  number: number;
  numberImageUrl: string;
  // Legacy fields for backward compatibility
  numbers?: number[];
  imageType?: 'regular' | 'hand';
}

// Color Exercise
export interface ColorExercise extends Exercise {
  exerciseType: 'color';
  colorName: string;
  colorHex: string;
  colorImageUrl: string;
  // Legacy field for backward compatibility
  colorChallenges?: ColorChallenge[];
}

export interface ColorChallenge {
  fruit: 'apple' | 'banana' | 'grape' | 'kiwi' | 'orange' | 'peach' | 'pineapple' | 'raspberry';
  correctColor: 'green' | 'yellow' | 'black' | 'purple' | 'brown' | 'orange' | 'pink' | 'red';
  wrongColors: string[];
}

// Create DTOs
export interface CreateUserDTO {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  googleId?: string;
  // Legacy fields
  username?: string;
  birthdate?: Date;
  emailVerified?: boolean;
}

export interface CreateUserGoogleDTO {
  email: string;
  googleId: string;
  firstName: string;
  lastName: string;
  username?: string;
  birthdate?: Date;
}

export interface CreateAdminUserDTO extends CreateUserDTO {
  isAdmin: boolean;
  adminCreationKey: string;
}

export interface CreateChildUserDTO {
  firstName: string;
  username: string;
  birthdate: Date;
  avatarUrl: string;
}

export interface CreateExerciseDTO {
  exerciseType: 'letter' | 'animal' | 'number' | 'color';
  title: string;
  description: string;
  durationMinutes: number;
  mainColor: string;
  thumbnailUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xp: number;
  ageRange: AgeRange;
  letters?: string[];
  animals?: string[];
  numbers?: number[];
  imageType?: 'regular' | 'hand';
  colorChallenges?: ColorChallenge[];
  availableToChildren?: string[];
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

// Generic Entity Management Types
export interface EntityField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'date' | 'boolean' | 'select' | 'textarea';
  required?: boolean;
  readonly?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: unknown) => string | undefined;
  };
}

export interface EntityConfig<T extends BaseEntity = BaseEntity> {
  name: string;
  namePlural: string;
  apiEndpoint: string;
  displayName: string;
  displayNamePlural: string;
  primaryKey: keyof T;
  fields: EntityField[];
  tableColumns: {
    key: keyof T;
    label: string;
    render?: (value: unknown, item: T) => React.ReactNode;
  }[];
  detailFields?: {
    key: keyof T;
    label: string;
    render?: (value: unknown, item: T) => React.ReactNode;
  }[];
  actions?: {
    create?: boolean;
    edit?: boolean;
    delete?: boolean | {
      enabled: boolean;
      condition?: (item: T, currentUser?: User) => boolean;
    };
    view?: boolean;
  };
}

export interface BaseEntity {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}