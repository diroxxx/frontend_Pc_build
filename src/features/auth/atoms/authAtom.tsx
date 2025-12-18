import { atom } from 'jotai';
import { jwtDecode } from 'jwt-decode';
import { setAuthToken } from '../hooks/Auth.tsx';
import { userAtom, type User, type CustomJwtPayload } from './userAtom.tsx';

export interface AuthState {
  isLoading: boolean;
  error: string | null;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const authStateAtom = atom<AuthState>({
  isLoading: false,
  error: null
});

export const loginAtom = atom(
  null,
  async (_get, set, data: LoginData) => {
    set(authStateAtom, { isLoading: true, error: null });

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ login: data.email, password: data.password })
      });

      if (response.status === 200) {
        const responseData = await response.json();
        
        // Store tokens
        setAuthToken(responseData.accessToken);
        
        // Decode and set user data
        const decoded: CustomJwtPayload = jwtDecode(responseData.accessToken);
        const user: User = {
          email: decoded.sub,
          role: decoded.role,
          nickname: decoded.username
        };
        set(userAtom, user);

        set(authStateAtom, { isLoading: false, error: null });
        
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Invalid email or password';
        
        set(authStateAtom, { isLoading: false, error: errorMessage });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Error during login:", error);
      const errorMessage = 'Network error. Please check your connection and try again.';
      
      set(authStateAtom, { isLoading: false, error: errorMessage });
      setAuthToken(null);
      
      return { success: false, error: errorMessage };
    }
  }
);

// Register action atom
export const registerAtom = atom(
  null,
  async (_get, set, data: RegisterData) => {
    set(authStateAtom, { isLoading: true, error: null });

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password
        })
      });

      if (response.status === 201) {
        set(authStateAtom, { isLoading: false, error: null });
        
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Registration failed. Please try again.';
        
        set(authStateAtom, { isLoading: false, error: errorMessage });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Error during registration:", error);
      const errorMessage = 'Network error. Please check your connection and try again.';
      
      set(authStateAtom, { isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }
);

// Clear error action atom
export const clearAuthErrorAtom = atom(
  null,
  (_get, set) => {
    set(authStateAtom, prev => ({ ...prev, error: null }));
  }
);
