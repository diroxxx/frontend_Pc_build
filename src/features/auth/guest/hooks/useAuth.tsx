import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { 
  authStateAtom, 
  loginAtom, 
  registerAtom, 
  clearAuthErrorAtom,
  type LoginData,
  type RegisterData
} from '../../../../atomContext/authAtom.tsx';

const useAuth = () => {
  const [authState] = useAtom(authStateAtom);
  const [, login] = useAtom(loginAtom);
  const [, register] = useAtom(registerAtom);
  const [, clearError] = useAtom(clearAuthErrorAtom);
  const navigate = useNavigate();

  const handleLogin = async (data: LoginData) => {
    const result = await login(data);
    if (result.success) {
      navigate("/");
    }
    return result;
  };

  const handleRegister = async (data: RegisterData) => {
    const result = await register(data);
    if (result.success) {
      navigate("/login", { 
        state: { message: 'Registration successful! Please log in with your credentials.' }
      });
    }
    return result;
  };

  return {
    isLoading: authState.isLoading,
    error: authState.error,
    login: handleLogin,
    register: handleRegister,
    clearError
  };
};

export default useAuth;