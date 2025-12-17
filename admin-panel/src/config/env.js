/**
 * Environment Configuration
 * Centralized configuration for development and production modes
 */

// Determine if we're in development mode
// import.meta.env.MODE can be 'development' or 'production' in Vite
// import.meta.env.DEV is a boolean that's true in development
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';

// Environment mode string
const ENV_MODE = import.meta.env.MODE || (isDevelopment ? 'development' : 'production');

// Export environment variables with defaults
export const config = {
  isDevelopment,
  isProduction,
  mode: ENV_MODE,
  // API URL
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
};

// Export individual values for convenience
export const isDev = isDevelopment;
export const isProd = isProduction;
export { isDevelopment, isProduction };

export default config;

