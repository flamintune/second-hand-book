export const API_BASE_URL = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_BASE_URL;

export const API_ROUTES = {
    AUTH: {
        LOGIN: '/login',
        SEND_CODE: '/login',
    },
    // 其他 API 路由...
} as const; 