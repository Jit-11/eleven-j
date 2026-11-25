export const API_URL = import.meta.env.VITE_API_URL || '';

export const ENDPOINTS = {
    subscribe: `${API_URL}/subscribe`,
    verify: `${API_URL}/verify`,
};