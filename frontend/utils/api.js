// Shared utility to dynamically resolve backend API URL
export const getApiUrl = () => {
  // If running in browser, check the hostname
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
      // Local development environment: use local URL or fallback
      return process.env.NEXT_PUBLIC_API_URL || `http://${hostname}:5000/api`;
    }
    
    // Public production environment (e.g., Vercel)
    // Always use the deployed backend URL on Render to avoid local address issues
    return 'https://jeshuverse-1.onrender.com/api';
  }
  
  // Fallback for Server-Side Rendering (SSR) in production
  return process.env.NEXT_PUBLIC_API_URL || 'https://jeshuverse-1.onrender.com/api';
};

export const API_URL = getApiUrl();
