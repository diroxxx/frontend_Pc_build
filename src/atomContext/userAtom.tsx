import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { jwtDecode } from 'jwt-decode';
import { getAuthToken, setAuthToken, setRefreshToken } from '../components/Auth';

export interface User {
  email: string;
  role: string;
  nickname: string;
}

export interface CustomJwtPayload {
  sub: string;
  role: string;
  username: string;
  exp: number;
}

export const userAtom = atomWithStorage<User | null>('user', null);
export const isAuthenticatedAtom = atom<boolean>((get) => {
  const user = get(userAtom);
  return user !== null;
});

export const loginUserAtom = atom(
  null,
  (get, set, token: string) => {
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      const user: User = {
        email: decoded.sub,
        role: decoded.role,
        nickname: decoded.username
      };
      
      setAuthToken(token);
      set(userAtom, user);
    } catch (error) {
      console.error('Błąd dekodowania tokenu:', error);
      throw new Error('Nieprawidłowy token');
    }
  }
);

// Action to logout user
export const logoutUserAtom = atom(
  null,
  (get, set) => {
    setAuthToken(null);
    setRefreshToken(null);
    set(userAtom, null);
    
    // Clear user-specific data
    localStorage.removeItem('computers');
    localStorage.removeItem('computers_last_sync');
    localStorage.removeItem('selectedComputerId');
  }
);

export const initializeUserAtom = atom(
  null,
  (get, set) => {
    const token = getAuthToken();
    if (!token) {
      set(userAtom, null);
      return;
    }

    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      
      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        console.log('Token wygasł');
        set(logoutUserAtom);
        return;
      }

      const user: User = {
        email: decoded.sub,
        role: decoded.role,
        nickname: decoded.username
      };
      
      set(userAtom, user);
    } catch (error) {
      console.error('Błąd inicjalizacji użytkownika:', error);
      set(logoutUserAtom);
    }
  }
);

// Computed atom to check if user can save computers
export const canSaveComputersAtom = atom<boolean>((get) => {
  const user = get(userAtom);
  return user !== null; // Tylko zalogowani użytkownicy mogą zapisywać
});