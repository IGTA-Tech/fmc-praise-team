// Constants used throughout the FMC Praise Team application

import { SongType } from '@/types';

// ========================================
// SONG RELATED
// ========================================

export const SONG_TYPES: SongType[] = [
  'Opening',
  'Offering',
  'Sermonic',
  'Communion',
  'Closing',
  'Other',
];

export const SONG_TYPE_COLORS: Record<SongType, string> = {
  Opening: 'bg-purple-100 text-purple-800 border-purple-300',
  Offering: 'bg-blue-100 text-blue-800 border-blue-300',
  Sermonic: 'bg-green-100 text-green-800 border-green-300',
  Communion: 'bg-amber-100 text-amber-800 border-amber-300',
  Closing: 'bg-pink-100 text-pink-800 border-pink-300',
  Other: 'bg-gray-100 text-gray-800 border-gray-300',
};

// ========================================
// TEAM MEMBERS
// ========================================

export const TEAM_MEMBERS = [
  'Adeline',
  'Clarissa',
  'Ms. McDowell',
  'Chris',
  'David',
  'Pastor Jones',
  'Sister Thompson',
  'Brother Williams',
  'Minister Jackson',
  'Sister Davis',
] as const;

export const WORSHIP_LEADERS = [
  'Adeline',
  'Pastor Jones',
  'Minister Jackson',
  'Chris',
  'David',
] as const;

// ========================================
// ATTIRE OPTIONS
// ========================================

export const ATTIRE_OPTIONS = [
  'All white',
  'All black',
  'Red, black, white',
  'Purple and gold',
  'Blue and white',
  'Casual',
  'Formal',
  'Choir robes',
] as const;

// ========================================
// THEME COLORS
// ========================================

export const THEME_COLORS = {
  primary: {
    DEFAULT: '#6B46C1', // Purple
    light: '#9F7AEA',
    dark: '#553C9A',
  },
  secondary: {
    DEFAULT: '#FFFFFF', // White
    light: '#F7FAFC',
    dark: '#E2E8F0',
  },
} as const;

// ========================================
// API CONFIGURATION
// ========================================

export const API_CONFIG = {
  RATE_LIMIT: {
    PUBLIC: 10, // requests per minute
    ADMIN: 60,  // requests per minute
  },
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes in milliseconds
  REQUEST_TIMEOUT: 30000, // 30 seconds
} as const;

// ========================================
// PAGINATION
// ========================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// ========================================
// JWT CONFIGURATION
// ========================================

export const JWT_CONFIG = {
  EXPIRY: '7d', // 7 days
  COOKIE_NAME: 'fmc_admin_token',
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60, // 7 days in seconds
} as const;

// ========================================
// EMAIL VERIFICATION
// ========================================

export const EMAIL_CONFIG = {
  VERIFICATION_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  COOKIE_NAME: 'fmc_email_verified',
  COOKIE_MAX_AGE: 30 * 24 * 60 * 60, // 30 days in seconds
} as const;

// ========================================
// YOUTUBE CONFIGURATION
// ========================================

export const YOUTUBE_CONFIG = {
  EMBED_BASE_URL: 'https://www.youtube.com/embed/',
  THUMBNAIL_BASE_URL: 'https://img.youtube.com/vi/',
  THUMBNAIL_QUALITY: {
    DEFAULT: 'default.jpg',
    MEDIUM: 'mqdefault.jpg',
    HIGH: 'hqdefault.jpg',
    STANDARD: 'sddefault.jpg',
    MAX: 'maxresdefault.jpg',
  },
  PLAYER_SPEEDS: [0.5, 0.75, 1, 1.25, 1.5, 2],
} as const;

// ========================================
// GOOGLE SHEETS CONFIGURATION
// ========================================

export const SHEETS_CONFIG = {
  SHEET_NAME: 'FMC Praise Team Schedule',
  HEADER_ROW: 1,
  DATA_START_ROW: 2,
  BATCH_SIZE: 100,
} as const;

// ========================================
// UI CONFIGURATION
// ========================================

export const UI_CONFIG = {
  TOAST_DURATION: 3000, // 3 seconds
  DEBOUNCE_DELAY: 300, // 300ms for search inputs
  MIN_TAP_TARGET: 44, // 44px minimum for mobile tap targets
  TRANSITION_DURATION: 200, // 200ms for smooth transitions
} as const;

// ========================================
// ERROR MESSAGES
// ========================================

export const ERROR_MESSAGES = {
  GENERIC: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  AUTHENTICATION: 'Authentication failed. Please log in again.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION: 'Please check your input and try again.',
  UNAUTHORIZED: 'You do not have permission to perform this action.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
} as const;

// ========================================
// SUCCESS MESSAGES
// ========================================

export const SUCCESS_MESSAGES = {
  WEEK_CREATED: 'Week created successfully!',
  WEEK_UPDATED: 'Week updated successfully!',
  WEEK_DELETED: 'Week deleted successfully!',
  LOGIN_SUCCESS: 'Logged in successfully!',
  EMAIL_VERIFIED: 'Email verified successfully!',
} as const;
