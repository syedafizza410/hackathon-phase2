// lib/auth.ts
import { User } from '@/types';
import { setToken, removeToken, getToken } from '@/utils/tokenStorage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const AUTH_BASE_URL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:8000';

// Authentication service that works with backend's auth endpoints
export const authService = {
  async signup(email: string, password: string, name: string) {
    try {
      // Using backend's register endpoint
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      // Handle non-JSON responses
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (e) {
          // If JSON parsing fails, create a generic error response
          data = { detail: `Failed to parse response: ${e}` };
        }
      } else {
        // If not JSON, try to get text response for error details
        const text = await response.text();
        data = { detail: text || `HTTP error ${response.status}` };
      }

      if (response.ok) {
        // Verify that the response contains a valid JWT token
        if (data.access_token) {
          // Verify that the token is a valid JWT format before storing
          const tokenParts = data.access_token.split('.');
          if (tokenParts.length === 3) {
            setToken(data.access_token);
          } else {
            console.error('Received invalid JWT token from backend');
            return {
              success: false,
              error: 'Invalid token received from server',
            };
          }
        }

        return {
          success: true,
          data: {
            user: {
              id: data.user_id || `user_${Date.now()}`, // fallback if not provided
              email: data.email || email,
              name: data.name || name,
              createdAt: new Date().toISOString()
            },
            token: data.access_token,
          },
        };
      } else {
        return {
          success: false,
          error: data.detail || data.error || `Registration failed with status ${response.status}`,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An error occurred during signup',
      };
    }
  },

  async signin(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Handle non-JSON responses
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (e) {
          // If JSON parsing fails, create a generic error response
          data = { detail: `Failed to parse response: ${e}` };
        }
      } else {
        // If not JSON, try to get text response for error details
        const text = await response.text();
        data = { detail: text || `HTTP error ${response.status}` };
      }

      if (response.ok) {
        // Verify that the response contains a valid JWT token
        if (data.access_token) {
          // Verify that the token is a valid JWT format before storing
          const tokenParts = data.access_token.split('.');
          if (tokenParts.length === 3) {
            setToken(data.access_token);
          } else {
            console.error('Received invalid JWT token from backend');
            return {
              success: false,
              error: 'Invalid token received from server',
            };
          }
        }

        return {
          success: true,
          data: {
            user: {
              id: data.user_id || `user_${Date.now()}`, // fallback if not provided
              email: data.email || email,
              name: data.name || email.split('@')[0],
              createdAt: new Date().toISOString()
            },
            token: data.access_token,
          },
        };
      } else {
        return {
          success: false,
          error: data.detail || data.error || `Login failed with status ${response.status}`,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An error occurred during login',
      };
    }
  },

  async signout() {
    try {
      // Remove the token from localStorage
      removeToken();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An error occurred during logout',
      };
    }
  },

  async getCurrentUser(): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      // Since the backend JWT contains user info, we can decode it locally
      const token = getToken();
      if (!token) {
        return {
          success: false,
          error: 'No active session',
        };
      }

      // Check if the token looks like a JWT (has 3 parts separated by dots)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        // If it's not a valid JWT, clear the invalid token and return an error
        console.warn('Invalid token format detected, clearing token');
        removeToken();
        return {
          success: false,
          error: 'Invalid token format: not a valid JWT',
        };
      }

      // Decode the token to get user information
      try {
        const base64Url = tokenParts[1];
        if (!base64Url) {
          throw new Error('Invalid token format: no payload found');
        }

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const tokenPayload = JSON.parse(jsonPayload);

        const user: User = {
          id: tokenPayload.sub || '', // The user ID should be in the 'sub' claim
          email: tokenPayload.email || 'unknown@example.com',
          name: tokenPayload.name || 'Unknown User',
          createdAt: tokenPayload.iat ? new Date(tokenPayload.iat * 1000).toISOString() : new Date().toISOString()
        };

        // Ensure the user has an ID
        if (!user.id) {
          return {
            success: false,
            error: 'User ID is missing from token',
          };
        }

        return {
          success: true,
          data: user,
        };
      } catch (decodeError: any) {
        console.error('Error decoding token:', decodeError);
        // If there's an error decoding, clear the invalid token
        removeToken();
        return {
          success: false,
          error: `Invalid token format: ${decodeError.message || 'Token decoding failed'}`,
        };
      }
    } catch (error: any) {
      console.error('Error in getCurrentUser:', error);
      return {
        success: false,
        error: error.message || 'An error occurred while getting user',
      };
    }
  },
};

export default authService;