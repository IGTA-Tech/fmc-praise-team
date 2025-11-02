// Core type definitions for FMC Praise Team application

import { z } from 'zod';

// ========================================
// SONG TYPES
// ========================================

export type SongType = 'Opening' | 'Offering' | 'Sermonic' | 'Communion' | 'Closing' | 'Other';

export interface Song {
  id: string;
  title: string;
  youtube_url: string;
  youtube_id: string;
  lead_singer: string;
  type: SongType;
  notes?: string;
  thumbnail?: string;
  duration?: string; // Format: "3:45"
  view_count?: number;
  order: number;
  created_at?: Date;
  updated_at?: Date;
}

// ========================================
// WEEK TYPES
// ========================================

export interface Week {
  id: string;
  date: Date; // Service date
  month: string; // e.g., "January 2025"
  rehearsal_date?: Date;
  attire?: string;
  worship_leader?: string;
  serving_members?: string[]; // Array of member names
  songs: Song[];
  created_at: Date;
  updated_at: Date;
}

// ========================================
// USER TYPES
// ========================================

export interface User {
  id: string;
  email: string;
  verified: boolean;
  verification_token?: string;
  verification_expires?: Date;
  created_at: Date;
}

export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  created_at: Date;
}

// ========================================
// API RESPONSE TYPES
// ========================================

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ========================================
// YOUTUBE TYPES
// ========================================

export interface YouTubeVideoData {
  id: string;
  title: string;
  thumbnail: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
    standard?: string;
    maxres?: string;
  };
  duration: string; // ISO 8601 duration format (PT3M45S)
  duration_formatted: string; // Human readable (3:45)
  view_count: number;
  channel_title: string;
  published_at: string;
}

// ========================================
// FORM SCHEMAS (Zod)
// ========================================

// Song form schema
export const songSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  youtube_url: z.string().url('Must be a valid URL').refine(
    (url) => url.includes('youtube.com') || url.includes('youtu.be'),
    'Must be a YouTube URL'
  ),
  lead_singer: z.string().min(1, 'Lead singer is required'),
  type: z.enum(['Opening', 'Offering', 'Sermonic', 'Communion', 'Closing', 'Other']),
  notes: z.string().optional(),
  order: z.number().min(0),
});

export type SongFormData = z.infer<typeof songSchema>;

// Week form schema - Step 1: Weekly Context
export const weekContextSchema = z.object({
  date: z.date({
    message: 'Service date is required',
  }),
  rehearsal_date: z.date().optional(),
  attire: z.string().optional(),
  worship_leader: z.string().optional(),
  serving_members: z.array(z.string()).optional(),
});

export type WeekContextFormData = z.infer<typeof weekContextSchema>;

// Week form schema - Complete (Step 1 + Step 2)
export const weekSchema = z.object({
  date: z.date({
    message: 'Service date is required',
  }),
  rehearsal_date: z.date().optional(),
  attire: z.string().optional(),
  worship_leader: z.string().optional(),
  serving_members: z.array(z.string()).optional(),
  songs: z.array(songSchema).min(1, 'At least one song is required'),
});

export type WeekFormData = z.infer<typeof weekSchema>;

// Login form schema
export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Email verification schema
export const emailVerificationSchema = z.object({
  email: z.string().email('Must be a valid email address'),
});

export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;

// ========================================
// JWT PAYLOAD TYPES
// ========================================

export interface JWTPayload {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
}

// ========================================
// FILTER & SEARCH TYPES
// ========================================

export interface WeekFilters {
  month?: string;
  worship_leader?: string;
  search?: string; // Search in song titles, leaders, etc.
  startDate?: Date;
  endDate?: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ========================================
// GOOGLE SHEETS TYPES
// ========================================

export interface SheetsConfig {
  spreadsheetId: string;
  sheetName: string;
  serviceAccountEmail: string;
  privateKey: string;
}

export interface SheetRow {
  [key: string]: string | number | Date;
}

// ========================================
// CONSTANTS
// ========================================

export const SONG_TYPES: SongType[] = [
  'Opening',
  'Offering',
  'Sermonic',
  'Communion',
  'Closing',
  'Other',
];

export const TEAM_MEMBERS = [
  'Adeline',
  'Clarissa',
  'Ms. McDowell',
  'Chris',
  'David',
  'Pastor Jones',
  'Sister Thompson',
  'Brother Williams',
] as const;

export const ATTIRE_OPTIONS = [
  'All white',
  'All black',
  'Red, black, white',
  'Purple and gold',
  'Casual',
  'Formal',
] as const;

// ========================================
// ERROR TYPES
// ========================================

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}
