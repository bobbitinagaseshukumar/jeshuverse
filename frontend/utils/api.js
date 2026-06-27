// Shared utility to dynamically resolve backend API URL
export const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // If running in browser, dynamically construct API URL using the current host
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Check if accessing via localhost or local network IPs
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('172.') ||
      hostname.startsWith('10.')
    ) {
      return `http://${hostname}:5000/api`;
    }
    // Fallback: If accessing a public deployment (like Vercel) but NEXT_PUBLIC_API_URL is not set,
    // point to your actual deployed backend service on Render.
    return 'https://jeshuverse-1.onrender.com/api';
  }
  // Fallback for Server-Side Rendering (SSR) in production
  return 'https://jeshuverse-1.onrender.com/api';
};

export const API_URL = getApiUrl();
