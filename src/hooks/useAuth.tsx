import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { setAuthToken, setRefreshToken } from '../components/Auth';
import { useUser } from '../components/UserContext';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface AuthState {
  isLoading: boolean;
  error: string | null;
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null
  });
  
  const navigate = useNavigate();
  const { setUser } = useUser();

  const login = useCallback(async (data: LoginData) => {
    setAuthState({ isLoading: true, error: null });

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
        setRefreshToken(responseData.refreshToken);
        
        // Decode and set user data
        const decoded: any = jwtDecode(responseData.accessToken);
        setUser({
          email: decoded.sub,
          role: decoded.role,
          nickname: decoded.username
        });

        setAuthState({ isLoading: false, error: null });
        
        // Navigate to home page
        navigate("/");
        
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Invalid email or password';
        
        setAuthState({ isLoading: false, error: errorMessage });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Error during login:", error);
      const errorMessage = 'Network error. Please check your connection and try again.';
      
      setAuthState({ isLoading: false, error: errorMessage });
      setAuthToken(null);
      
      return { success: false, error: errorMessage };
    }
  }, [navigate, setUser]);

  const register = useCallback(async (data: RegisterData) => {
    setAuthState({ isLoading: true, error: null });

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
        setAuthState({ isLoading: false, error: null });
        
        // Navigate to login page with success message
        navigate("/login", { 
          state: { message: 'Registration successful! Please log in with your credentials.' }
        });
        
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Registration failed. Please try again.';
        
        setAuthState({ isLoading: false, error: errorMessage });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Error during registration:", error);
      const errorMessage = 'Network error. Please check your connection and try again.';
      
      setAuthState({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, [navigate]);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    register,
    clearError
  };
};

export default useAuth;