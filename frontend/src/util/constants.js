// Application constants

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CREATOR_PROFILE: '/creator/:id',
  CREATOR_DASHBOARD: '/dashboard',
  SUPPORTER_PROFILE: '/supporter',
};

export const USER_ROLES = {
  CREATOR: 'creator',
  SUPPORTER: 'supporter',
};

export const POST_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO_EMBED: 'videoEmbed',
  LINK: 'link',
};

export const ACCESS_TYPES = {
  FREE: 'free',
  SUPPORTER_ONLY: 'supporter-only',
  MEMBERSHIP_ONLY: 'membership-only',
};

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
};

