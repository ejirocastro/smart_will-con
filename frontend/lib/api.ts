/**
 * API Client for SmartWill Backend
 * Handles HTTP requests and authentication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://smart-will-con.onrender.com';

interface ApiResponse<T = any> {
    data?: T;
    message?: string;
    error?: string;
}

class ApiClient {
    private baseURL: string;
    
    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    /**
     * Get stored authentication token
     */
    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('smartwill_token');
    }

    /**
     * Make HTTP request with proper headers
     */
    private async request<T>(
        endpoint: string, 
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;
        const token = this.getToken();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.headers as Record<string, string>
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    error: data.error || `HTTP error! status: ${response.status}`
                };
            }

            return { data };
        } catch (error) {
            console.error('API request failed:', error);
            return {
                error: error instanceof Error ? error.message : 'Network error'
            };
        }
    }

    /**
     * Authentication endpoints
     */
    async login(credentials: { email: string; password: string }) {
        return this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    async signup(userData: { 
        email: string; 
        password: string; 
        role: string; 
        name?: string; 
    }) {
        return this.request('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async getCurrentUser() {
        return this.request('/api/auth/me');
    }

    async logout() {
        return this.request('/api/auth/logout', {
            method: 'POST'
        });
    }

    async refreshToken() {
        return this.request('/api/auth/refresh', {
            method: 'POST'
        });
    }

    async verifyEmail(code: string, email: string) {
        return this.request('/api/auth/verify-email', {
            method: 'POST',
            body: JSON.stringify({ code, email })
        });
    }

    async resendVerification(email: string) {
        return this.request('/api/auth/resend-verification', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    /**
     * Health check
     */
    async healthCheck() {
        return this.request('/health');
    }
}

export const apiClient = new ApiClient();
export default apiClient;