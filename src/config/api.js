// API Configuration
// Development: Uses proxy (configured in vite.config.js)
// Production: Uses full API URL from environment variable

const getApiBaseUrl = (path) => {
  // Production'da environment variable'dan al, yoksa production API URL'i kullan
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api-magazam.onrender.com';
  
  // Development'ta relative path kullan (proxy üzerinden gider)
  // Production'da full URL kullan
  if (import.meta.env.PROD) {
    return `${apiBaseUrl}${path}`;
  }
  
  // Development: proxy kullan (relative path)
  return path;
};

export const API_BASE_URL = getApiBaseUrl('/api/v1');
export const CRUD_BASE_URL = getApiBaseUrl('/crud/v1');
