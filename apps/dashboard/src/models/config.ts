/** Base URL of the P2H/P5M API, overridable via VITE_API_URL for other environments. */
export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
