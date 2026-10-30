/**
 * Central configuration for API client communication.
 * Defaults to http://localhost:5000 in development unless overridden by VITE_API_URL.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

