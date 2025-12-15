// API Configuration
// API URL-ləri vite.config.js-dəki proxy target-dan alınır
// Development-da: proxy istifadə olunur (relative path)
// Production-da: doğrudan target URL istifadə olunur

// @ts-ignore - Vite define ilə build zamanında replace olunur
const API_TARGET = __API_TARGET__;
// @ts-ignore - Vite define ilə build zamanında replace olunur
const API_BASE_URL_DEV = __API_BASE_URL__;
// @ts-ignore - Vite define ilə build zamanında replace olunur
const CRUD_BASE_URL_DEV = __CRUD_BASE_URL__;
// @ts-ignore - Vite define ilə build zamanında replace olunur
const API_BASE_URL_PROD = __API_BASE_URL_PROD__;
// @ts-ignore - Vite define ilə build zamanında replace olunur
const CRUD_BASE_URL_PROD = __CRUD_BASE_URL_PROD__;

// Development-da proxy istifadə et, production-da doğrudan target URL
export const API_BASE_URL = import.meta.env.DEV ? API_BASE_URL_DEV : API_BASE_URL_PROD;
export const CRUD_BASE_URL = import.meta.env.DEV ? CRUD_BASE_URL_DEV : CRUD_BASE_URL_PROD;



