const rawApiUrl = import.meta.env.VITE_API_URL || 'https://rocket-backend-20r0.onrender.com';
const API_BASE_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

export default API_BASE_URL;
